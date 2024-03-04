import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_SECTOR_YOU_WORK_IN, BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, {
        previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
        title: "What is the business name?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                title: "What is the business name?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME,
                ...pageProperties
            });
        } else {
            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
