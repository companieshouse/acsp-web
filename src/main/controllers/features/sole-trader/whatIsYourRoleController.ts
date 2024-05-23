import { Request, Response, NextFunction } from "express";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, SOLE_TRADER_WHAT_IS_YOUR_NAME, SOLE_TRADER_WHAT_IS_YOUR_ROLE, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE;
    try {
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);
        res.render(config.WHAT_IS_YOUR_ROLE, {
            title: "What is your role in the business?",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage,
            acspType: acspData?.typeOfBusiness
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedRole = req.body.WhatIsYourRole;
        const previousPage: string = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
        const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE;
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                title: "What is your role in the business?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                previousPage,
                acspType: acspData?.typeOfBusiness,
                ...pageProperties
            });

        } else {
            if (acspData) {
                acspData.roleType = req.body.WhatIsYourRole;
            }
            try {
                //  save data to mongodb
                await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
                if (selectedRole === "SOLE_TRADER") {
                    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                    detailsAnswers.roleType = "I am the sole trader";
                    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                    res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang));
                } else {
                    res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
                }
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, currentUrl);
            }
        }

    } catch (error) {
        next(error);
    }
};
