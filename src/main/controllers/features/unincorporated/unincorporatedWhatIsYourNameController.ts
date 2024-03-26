import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_NAME_REGISTERED_WITH_AML, UNINCORPORATED_WHAT_IS_YOUR_NAME } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    console.log("reached");
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.WHAT_IS_YOUR_NAME, {
        title: "What is your name?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        console.log(errorList);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_NAME, {
                title: "What is your name?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME,
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            res.redirect(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
