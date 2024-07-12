import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_SELECT_AML_SUPERVISOR, BASE_URL, AML_MEMBERSHIP_NUMBER, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, UNINCORPORATED_CORRESPONDENCE_ADDRESS, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AmlSupervisoryBodyService } from "../../../services/amlSupervisoryBody/amlBodyService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        // collect selectedAMLs to render the page with saved data
        const selectedAMLSupervisoryBodies: string[] = [];
        const amlSupervisoryBody = new AmlSupervisoryBodyService();
        amlSupervisoryBody.getSelectedAML(acspData, selectedAMLSupervisoryBodies);

        res.render(config.SELECT_AML_SUPERVISOR, {
            previousPage: addLangToUrl(getPreviousPage(session), lang),
            ...getLocaleInfo(locales, lang),
            acspType: acspData?.typeOfBusiness,
            currentUrl,
            AMLSupervisoryBodies,
            selectedAMLSupervisoryBodies,
            businessName: acspData?.businessName
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR;
    try {
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SELECT_AML_SUPERVISOR, {
                previousPage: addLangToUrl(getPreviousPage(session), lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                acspType: acspData?.typeOfBusiness,
                businessName: acspData?.businessName,
                AMLSupervisoryBodies,
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

const getPreviousPage = (session: Session): string => {
    const correspondenceAddress: string = session?.getExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS)!;
    let previousPage;
    if (correspondenceAddress === "CORRESPONDANCE_ADDRESS") {
        previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM;
    }
    return previousPage;
};
