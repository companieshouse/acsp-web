import { NextFunction, Request, Response } from "express";
import { BASE_URL, AML_BODY_DETAILS_CONFIRM, AML_MEMBERSHIP_NUMBER, LIMITED_SELECT_AML_SUPERVISOR, SOLE_TRADER_SELECT_AML_SUPERVISOR, UNINCORPORATED_SELECT_AML_SUPERVISOR } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { formatValidationError, resolveErrorMessage, getPageProperties } from "../../../validation/validation";
import { validationResult } from "express-validator";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AmlSupervisoryBodyService } from "../../../../main/services/amlSupervisoryBody/amlBodyService";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const acspType: string = acspData?.typeOfBusiness!;
    const previousPage: string = getPreviousPage(acspType);
    const currentUrl: string = BASE_URL + AML_MEMBERSHIP_NUMBER;
    
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);
        saveDataInSession(req, USER_DATA, acspData);

        //collect selected AMLs
        const selectedAMLSupervisoryBodies: string[] = []
        const amlSupervisoryBody = new AmlSupervisoryBodyService();
        amlSupervisoryBody.getSelectedAML(acspData, selectedAMLSupervisoryBodies);   

        //collect membership numbers to render the page with saved data
        let payload;
        amlSupervisoryBody.getMembershipNumbers(acspData, selectedAMLSupervisoryBodies, payload);   
        
        res.render(config.AML_MEMBERSHIP_NUMBER, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            selectedAMLSupervisoryBodies,
            payload
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, addLangToUrl(previousPage, lang), currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const acspType: string = acspData?.typeOfBusiness!;
    const previousPage: string = getPreviousPage(acspType);
    const currentUrl: string = BASE_URL + AML_MEMBERSHIP_NUMBER;

    //collect selected AMLs
    const selectedAMLSupervisoryBodies: string[] = []
    const amlSupervisoryBody = new AmlSupervisoryBodyService();
    amlSupervisoryBody.getSelectedAML(acspData, selectedAMLSupervisoryBodies);   

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            errorListDisplay(errorList.array(), selectedAMLSupervisoryBodies, lang);
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                previousPage,
                title: "What is the Anti-Money Laundering (AML) membership number?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                selectedAMLSupervisoryBodies
            });
        } else {
            // update acspData
            const amlSupervisoryBodies: Array<AmlSupervisoryBody> = [];
            amlSupervisoryBody.saveAmlSupervisoryBodies(req,acspData, selectedAMLSupervisoryBodies, amlSupervisoryBodies);  

            try {
                //  save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

                const nextPageUrl = addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang);
                res.redirect(nextPageUrl);
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, addLangToUrl(previousPage, lang), currentUrl);
            }
        }
    } catch (error) {
        next(error);
    }
};

const errorListDisplay = (errors: any[], selectedAMLSupervisoryBodies: string[], lang: string) => {
    return errors.forEach((element, index) => {
        const selection = selectedAMLSupervisoryBodies[index];
        element.msg = resolveErrorMessage(element.msg, lang);
        element.msg = element.msg + selection;
        return element;

    });
};

const getPreviousPage = (ascpType: string): string => {
    switch (ascpType) {
    case "SOLE_TRADER":
        return BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    case "LIMITED_COMPANY":
    case "LIMITED_PARTNERSHIP":
    case "LIMITED_LIABILITY_PARTNERSHIP":
        return BASE_URL + LIMITED_SELECT_AML_SUPERVISOR;
    default:
        return BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR;
    }
};
