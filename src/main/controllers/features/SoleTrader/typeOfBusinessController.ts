import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, START, OTHER_TYPE_OFBUSINESS, SOLE_TRADER_WHAT_IS_YOUR_ROLE, BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, UNINCORPORATED_NAME_REGISTERED_WITH_AML, HOME_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_TYPE_OF_BUSINESS, {
        previousPage: addLangToUrl(START, lang),
        title: "What type of business are you registering?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + TYPE_OF_BUSINESS,
        typeOfBusiness: req.query.typeOfBusiness
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.typeOfBusinessRadio;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(HOME_URL, lang),
                title: "What type of business are you registering?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + TYPE_OF_BUSINESS,
                ...pageProperties
            });
        } else {
            var nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang);

            switch (selectedOption) {
            case "LIMITED_COMPANY":
            case "LIMITED_PARTNERSHIP":
            case "LIMITED_LIABILITY_PARTNERSHIP":
                res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang));
                break;
            case "PATNERSHIP":
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));
                break;
            case "SOLE_TRADER":
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang));
                break;
            case "OTHER":
                res.redirect(addLangToUrl(BASE_URL + OTHER_TYPE_OFBUSINESS, lang));
                break;
            default:
                res.redirect(nextPageUrl);
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
