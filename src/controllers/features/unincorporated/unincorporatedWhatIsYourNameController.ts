import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_NAME_REGISTERED_WITH_AML, UNINCORPORATED_WHAT_IS_YOUR_NAME } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { ErrorService } from "../../../services/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            "first-name": acspData.firstName,
            "middle-names": acspData.middleName,
            "last-name": acspData.lastName
        };

        res.render(config.WHAT_IS_YOUR_NAME, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang),
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
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session.getExtraData(USER_DATA)!;
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_NAME, {
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang),
                currentUrl,
                ...pageProperties,
                payload: req.body
            });
        } else {
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.name = req.body["first-name"] + " " + req.body["last-name"];
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);

            // save to MongoDB
            if (acspData) {
                acspData.firstName = req.body["first-name"];
                acspData.middleName = req.body["middle-names"];
                acspData.lastName = req.body["last-name"];
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
            }
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
