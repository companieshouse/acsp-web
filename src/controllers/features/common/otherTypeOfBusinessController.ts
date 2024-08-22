import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + OTHER_TYPE_OF_BUSINESS;

    try {
        let acspData;
        if (session?.getExtraData("resume_application")) {
            // get data from mongo and save to session
            acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
            if (acspData !== undefined) {
                saveDataInSession(req, USER_DATA, acspData);
            }
        }

        res.render(config.OTHER_TYPE_OF_BUSINESS, {
            previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
            feedbackLink: "https://www.smartsurvey.co.uk/s/reg-as-acsp-slctd-other-on-co-type-page/",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            otherTypeOfBusiness: acspData?.typeOfBusiness
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
                ...pageProperties
            });
        } else {
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData, selectedOption);
            saveDataInSession(req, "resume_application", true);

            if (selectedOption === "CORPORATE_BODY") {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang));
            } else {
                // Redirect to Unincorporated journey Which name is registered with your Anti-Money Laundering (AML) supervisory body?
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
