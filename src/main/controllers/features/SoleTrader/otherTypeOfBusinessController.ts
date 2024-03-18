import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, UNINCORPORATED_WHAT_IS_YOUR_ROLE, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_OTHER_TYPE_OF_BUSINESS, {
        previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
        title: "What other type of business are you registering?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + OTHER_TYPE_OF_BUSINESS
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.otherTypeOfBusinessRadio;
        console.log(selectedOption);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_OTHER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                title: "What other type of business are you registering?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + OTHER_TYPE_OF_BUSINESS,
                ...pageProperties
            });
        } else {
            const nextPageUrlForAmlBody = addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang);
            const nextPageUrlForYourRole = addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang);
            // res.redirect(nextPageUrl);
            switch (selectedOption) {
            case "UNINCORPORATED_ENTITY":
                res.redirect(nextPageUrlForAmlBody); // Redirect to Unincorporated journey] Which name is registered with your Anti-Money Laundering (AML) supervisory body?
                break;
            default:
                res.redirect(nextPageUrlForYourRole); // Redirect to what is you role?
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
