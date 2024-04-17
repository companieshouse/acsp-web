import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHICH_SECTOR, STOP_NOT_RELEVANT_OFFICER } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session!;
    const acspData: ACSPData = session.getExtraData(USER_DATA)!;

    res.render(config.WHAT_IS_YOUR_ROLE, {
        title: "What is your role in the business?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE,
        acspType: acspData?.typeofBusiness,
        unincorporatedBusinessName: acspData?.businessName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session!;
        const acspData: ACSPData = session.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            return res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                title: "What is your role in the business?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE,
                pageProperties: pageProperties,
                payload: req.body,
                acspType: acspData?.typeofBusiness,
                unincorporatedBusinessName: acspData?.businessName,
                ...pageProperties
            });
        }

        if (req.body.WhatIsYourRole === "SOMEONE_ELSE") {
            res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
        } else {
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.roleType = "I am a member";
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang));
        }

    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
