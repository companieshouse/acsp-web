import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, STOP_NOT_RELEVANT_OFFICER, LIMITED_WHAT_IS_YOUR_ROLE, LIMITED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { POST_ACSP_REGISTRATION_DETAILS_ERROR, ANSWER_DATA, USER_DATA, SUBMISSION_ID } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Answers } from "../../../model/Answers";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session!;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
    const currentUrl: string = BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE;

    try {
        // get data from mongo
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);

        // save company authentication to DB
        if (acspData) {
            acspData.companyAuthCodeProvided = true;
        }
        const acspDataService = new AcspDataService();
        await acspDataService.saveAcspData(session, acspData);

        // save to session
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.WHAT_IS_YOUR_ROLE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            acspType: acspData?.typeOfBusiness,
            company: acspData?.companyDetails,
            unincorporatedBusinessName: acspData?.businessName,
            roleType: acspData?.roleType
        });
    } catch (err) {
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE;
    try {
        const errorList = validationResult(req);
        const session: Session = req.session!;
        const acspData: AcspData = session.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            return res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                ...getLocaleInfo(locales, lang),
                previousPage,
                currentUrl,
                acspType: acspData?.typeOfBusiness,
                company: acspData?.companyDetails,
                unincorporatedBusinessName: acspData?.businessName,
                ...pageProperties
            });
        } else {
            if (acspData) {
                acspData.roleType = req.body.WhatIsYourRole;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

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
                }
                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.roleType = role;
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                res.redirect(addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
