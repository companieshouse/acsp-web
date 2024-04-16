import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import {
    FormattedValidationErrors,
    formatValidationError
} from "../../../validation/validation";
import {
    selectLang,
    addLangToUrl,
    getLocalesService,
    getLocaleInfo
} from "../../../utils/localise";
import {
    LIMITED_SECTOR_YOU_WORK_IN,
    LIMITED_NAME_REGISTERED_WITH_AML,
    LIMITED_WHAT_IS_YOUR_ROLE,
    BASE_URL,
    LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT
} from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.NAME_REGISTERED_WITH_AML, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang),
        title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML
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
                previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang),
                title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML,
                ...pageProperties
            });
        } else {
            const redirectUrlAccordingToRole = selectedOption === "YOUR_NAME"
                ? LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT
                : LIMITED_SECTOR_YOU_WORK_IN;

            res.redirect(addLangToUrl(BASE_URL + redirectUrlAccordingToRole, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
