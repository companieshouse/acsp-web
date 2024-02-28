import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_TYPE_OF_BUSINESS, SOLE_TRADER_ROLE, SOLE_TRADER_OTHER_TYPE_OFBUSINESS, BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_OTHER_TYPE_OFBUSINESS, {
        previousPage: addLangToUrl(SOLE_TRADER_TYPE_OF_BUSINESS, lang),
        title: "What other type of business are you registering?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_OTHER_TYPE_OFBUSINESS
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_OTHER_TYPE_OFBUSINESS, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS, lang),
                title: "What other type of business are you registering?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_OTHER_TYPE_OFBUSINESS,
                ...pageProperties
            });
        } else {
            var nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_ROLE, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
