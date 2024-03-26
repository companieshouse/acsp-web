import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, STOP_NOT_RELEVANT_OFFICER, LIMITED_WHAT_IS_YOUR_ROLE, LIMITED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_TYPE, COMPANY_DETAILS } from "../../../common/__utils/constants";
import { Company } from "../../../model/Company";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspType = session?.getExtraData(ACSP_TYPE)!;
    const company : Company = session?.getExtraData(COMPANY_DETAILS)!;
    res.render(config.WHAT_IS_YOUR_ROLE, {
        title: "What is your role in the business?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
        currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE,
        acspType: acspType,
        company: company
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                title: "What is your role in the business?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
                currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE,
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            if (req.body.WhatIsYourRole === "SOMEONE_ELSE") {
                res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
            } else {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
