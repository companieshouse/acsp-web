import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_NAME_REGISTERED_WITH_AML, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_NAME, BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.NAME_REGISTERED_WITH_AML, {
        previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
        title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.nameRegisteredWithAml;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.NAME_REGISTERED_WITH_AML, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML,
                ...pageProperties
            });
        } else {
            const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME, lang);
            const nextPageUrlForBoth = addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang);
            // res.redirect(nextPageUrl);
            switch (selectedOption) {
            case "NAME_OF_THE_BUSINESS":
                res.redirect(nextPageUrlForBoth); // Redirect to another page whne your name selected
                break;
            default:
                res.redirect(nextPageUrl); // Redirect to the sector page for the other 2 options
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
