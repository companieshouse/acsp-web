import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, WHAT_IS_YOUR_ROLE } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, {
        previousPage: addLangToUrl(WHAT_IS_YOUR_ROLE, lang),
        title: "Which sector do you work in?",
        ...getLocaleInfo(locales, lang),
        currentUrl: SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, {
                previousPage: addLangToUrl(WHAT_IS_YOUR_ROLE, lang),
                title: "Which name is registered with your AML supervisory body?",
                ...getLocaleInfo(locales, lang),
                currentUrl: SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED,
                ...pageProperties
            });
        } else {
            const nextPageUrl = addLangToUrl(SOLE_TRADER_SECTOR_YOU_WORK_IN, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
