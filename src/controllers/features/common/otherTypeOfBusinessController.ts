import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, TYPE_OF_BUSINESS_SELECTED, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import * as config from "../../../config";
import { AcspDataService } from "../../../services/acspDataService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, OTHER_TYPE_OF_BUSINESS, TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import logger from "../../../utils/logger";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { PIWIK_REGISTRATION_CORPORATE_BODY_ID, PIWIK_REGISTRATION_UNINCORPORATED_ID } from "../../../utils/properties";
import { getSavedApplication } from "../../../services/transactions/transaction_service";
import { getRedirectionUrl } from "../../../services/checkSavedApplicationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + OTHER_TYPE_OF_BUSINESS;

    try {
        let acspData;
        if (session?.getExtraData("resume_application")) {
            // get data from mongo and save to session
            acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
            if (acspData !== undefined) {
                saveDataInSession(req, USER_DATA, acspData);
            }
        } else {
            // Fix to check for existing applications and redirect accordingly
            // when resume_application is not set to prevent redirect loop
            const savedApplication = await getSavedApplication(session, res.locals.userId);
            const redirectionUrl = await getRedirectionUrl(savedApplication, session);
            const typeOfBusinessFlag = session.getExtraData(TYPE_OF_BUSINESS_SELECTED);
            if (redirectionUrl && !typeOfBusinessFlag) {
                return res.redirect(addLangToUrl(redirectionUrl, lang));
            }
        }

        res.render(config.OTHER_TYPE_OF_BUSINESS, {
            previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
            feedbackLink: "https://www.smartsurvey.co.uk/s/reg-as-acsp-slctd-other-on-co-type-page/",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            otherTypeOfBusiness: acspData?.typeOfBusiness,
            PIWIK_REGISTRATION_UNINCORPORATED_ID,
            PIWIK_REGISTRATION_CORPORATE_BODY_ID
        });

    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const errorList = validationResult(req);
    const selectedOption = req.body.otherTypeOfBusinessRadio;
    const currentUrl = BASE_URL + OTHER_TYPE_OF_BUSINESS;
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    try {
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.OTHER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                feedbackLink: "https://www.smartsurvey.co.uk/s/reg-as-acsp-slctd-other-on-co-type-page/",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties,
                PIWIK_REGISTRATION_UNINCORPORATED_ID,
                PIWIK_REGISTRATION_CORPORATE_BODY_ID
            });
        } else {
            const acspDataService = new AcspDataService();

            if (acspData != null && acspData.typeOfBusiness !== selectedOption) {
                await acspDataService.createNewApplication(session, selectedOption);
            } else {
                await acspDataService.saveAcspData(session, acspData, selectedOption);
            }

            saveDataInSession(req, "resume_application", true);
            session.deleteExtraData(TYPE_OF_BUSINESS_SELECTED);

            if (selectedOption === "CORPORATE_BODY") {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang));
            } else {
                // Redirect to Unincorporated journey Which name is registered with your Anti-Money Laundering (AML) supervisory body?
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
