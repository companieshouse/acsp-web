import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, STOP_NOT_RELEVANT_OFFICER, LIMITED_WHAT_IS_YOUR_ROLE, LIMITED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, ANSWER_DATA, COMPANY_DETAILS, USER_DATA, SUBMISSION_ID } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Answers } from "../../../model/Answers";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session!;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.WHAT_IS_YOUR_ROLE, {
            title: "What is your role in the business?",
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
            currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE,
            acspType: acspData?.typeOfBusiness,
            company: acspData?.companyDetails
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        res.status(400).render(config.ERROR_404, {
            previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
            title: "Page not found",
            ...getLocaleInfo(locales, lang),
            currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE
        });
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session!;
        const acspData: AcspData = session.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            return res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                title: "What is your role in the business?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
                currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE,
                acspType: acspData?.typeOfBusiness,
                company: acspData?.companyDetails,
                payload: req.body,
                ...pageProperties
            });
        } else {
            if (acspData) {
                acspData.roleType = req.body.WhatIsYourRole;
            }
            try {
                //  save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

                if (req.body.WhatIsYourRole === "SOMEONE_ELSE") {
                    res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
                } else {
                    let role;
                    switch (req.body.WhatIsYourRole) {
                    case "DIRECTOR":
                        role = "I am a director";
                        break;
                    case "MEMBER_OF_LLP":
                        role = "I am a member of the partnership";
                        break;
                    case "GENERAL_PARTNER":
                        role = "I am a general partner";
                        break;
                    }
                    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                    detailsAnswers.roleType = role;
                    saveDataInSession(req, ANSWER_DATA, detailsAnswers);

                    res.redirect(addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang));
                }
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                res.status(400).render(config.ERROR_404, {
                    previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
                    title: "Page not found",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE
                });
            }
        }
    } catch (error) {
        next(error);
    }
};
