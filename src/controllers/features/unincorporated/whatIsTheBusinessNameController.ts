import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, BASE_URL, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHAT_IS_YOUR_NAME, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, UNINCORPORATED_AML_SELECTED_OPTION, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            whatIsTheBusinessName: acspData.businessName
        };

        res.render(config.WHAT_IS_THE_BUSINESS_NAME, {
            previousPage: addLangToUrl(getPreviousPage(session), lang),
            ...getLocaleInfo(locales, lang),
            payload,
            currentUrl
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
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME;
    try {
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session.getExtraData(USER_DATA)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(getPreviousPage(session), lang),
                payload: req.body,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            // save to MongoDB
            if (acspData) {
                acspData.businessName = req.body.whatIsTheBusinessName;
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
            }
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

const getPreviousPage = (session: Session): string => {
    const unincorporatedAmlSelectedOption = session?.getExtraData(UNINCORPORATED_AML_SELECTED_OPTION)!;
    let previousPage;
    // Check if the selected option is "NAME_OF_THE_BUSINESS
    if (unincorporatedAmlSelectedOption === "NAME_OF_THE_BUSINESS") {
        previousPage = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;
    }
    return previousPage;
};
