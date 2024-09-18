import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_SELECT_AML_SUPERVISOR, SOLE_TRADER_WHAT_IS_YOUR_EMAIL, BASE_URL, AML_MEMBERSHIP_NUMBER } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBodyService } from "../../../services/amlSupervisoryBody/amlBodyService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    // const acspData: AcspData = session?.getExtraData(USER_DATA)!;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        // collect selectedAMLs to render the page with saved data
        const selectedAMLSupervisoryBodies: string[] = [];
        const amlSupervisoryBody = new AmlSupervisoryBodyService();
        amlSupervisoryBody.getSelectedAML(acspData, selectedAMLSupervisoryBodies);

        res.render(config.SELECT_AML_SUPERVISOR, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            acspType: acspData?.typeOfBusiness,
            AMLSupervisoryBodies,
            selectedAMLSupervisoryBodies
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + SOLE_TRADER_SELECT_AML_SUPERVISOR;
    try {

        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_EMAIL, lang);
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                AMLSupervisoryBodies,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName,
                acspType: acspData?.typeOfBusiness,
                ...pageProperties
            });
        } else {
            const amlSupervisoryBody = new AmlSupervisoryBodyService();
            amlSupervisoryBody.saveSelectedAML(req, acspData);
            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
