import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, OTHER_TYPE_OF_BUSINESS, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, SOLE_TRADER_WHAT_IS_YOUR_ROLE, BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { SUBMISSION_ID, POST_ACSP_REGISTRATION_DETAILS_ERROR, GET_ACSP_REGISTRATION_DETAILS_ERROR, USER_DATA } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { Session } from "@companieshouse/node-session-handler";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { FEATURE_FLAG_DISABLE_LIMITED_JOURNEY, FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY, PIWIK_REGISTRATION_LC_ID, PIWIK_REGISTRATION_LLP_ID, PIWIK_REGISTRATION_LP_ID, PIWIK_REGISTRATION_PARTNERSHIP_ID, PIWIK_REGISTRATION_SOLE_TRADER_ID } from "../../../utils/properties";
import { isActiveFeature } from "../../../utils/feature.flag";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";
import { getPreviousPageUrl } from "../../../services/url";
import { httpErrorHandler } from "../../errorController";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL, lang);
    const currentUrl: string = BASE_URL + TYPE_OF_BUSINESS;
    try {

        let typeOfBusiness = "";
        if (session?.getExtraData("resume_application")) {
            // get data from mongo and save to session
            const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
            if (acspData !== undefined) {
                saveDataInSession(req, USER_DATA, acspData);
                const prevUrl = getPreviousPageUrl(req, BASE_URL);
                const isRedirectedForSoleTrader: boolean = prevUrl?.includes(LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT);
                if (isRedirectedForSoleTrader) {
                    typeOfBusiness = "SOLE_TRADER";
                } else if (acspData.typeOfBusiness === "UNINCORPORATED" || acspData.typeOfBusiness === "CORPORATE_BODY") {
                    typeOfBusiness = "OTHER";
                } else {
                    typeOfBusiness = acspData.typeOfBusiness!;
                }
            }
        }

        res.render(config.TYPE_OF_BUSINESS, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            typeOfBusiness,
            FEATURE_FLAG_DISABLE_LIMITED_JOURNEY: isActiveFeature(FEATURE_FLAG_DISABLE_LIMITED_JOURNEY),
            FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY: isActiveFeature(FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY),
            PIWIK_REGISTRATION_LC_ID,
            PIWIK_REGISTRATION_LP_ID,
            PIWIK_REGISTRATION_LLP_ID,
            PIWIK_REGISTRATION_PARTNERSHIP_ID,
            PIWIK_REGISTRATION_SOLE_TRADER_ID
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
    const currentUrl: string = BASE_URL + TYPE_OF_BUSINESS;
    const errorList = validationResult(req);
    const selectedOption = req.body.typeOfBusinessRadio;
    const previousPage: string = addLangToUrl(BASE_URL, lang);
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    try {
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.TYPE_OF_BUSINESS, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties,
                PIWIK_REGISTRATION_LC_ID,
                PIWIK_REGISTRATION_LP_ID,
                PIWIK_REGISTRATION_LLP_ID,
                PIWIK_REGISTRATION_PARTNERSHIP_ID,
                PIWIK_REGISTRATION_SOLE_TRADER_ID
            });
        } else if (selectedOption !== "OTHER") {

            const acspDataService = new AcspDataService();

            if (acspData != null && acspData.typeOfBusiness !== selectedOption) {
                await acspDataService.createNewApplication(session, selectedOption);
            } else {
                await acspDataService.saveAcspData(session, acspData, selectedOption);
            }
            saveDataInSession(req, "resume_application", true);
            switch (selectedOption) {
            case "LC":
            case "LLP":
                res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang));
                break;
            case "PARTNERSHIP":
            case "LP":
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));
                break;
            case "SOLE_TRADER":
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang));
                break;
            }
        } else {
            res.redirect(addLangToUrl(BASE_URL + OTHER_TYPE_OF_BUSINESS, lang));
        }
    } catch (err: any) {
        console.log("LINE 117 - GOT INTO CATCH BLOCK - Type of Business Controller");
        console.log("LINE 122 - PRINT FULL ERR (Inspect):", err);
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const httpStatusCode = err.httpStatusCode;
        if (httpStatusCode === 401) {
            httpErrorHandler(err, req, res, next);
        } else {
            const error = new ErrorService();
            error.renderErrorPage(res, locales, lang, currentUrl);
        }
    }
};
