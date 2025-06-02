import { Request, Response, NextFunction } from "express";
import * as config from "../../../config";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, CLOSE_WHAT_WILL_HAPPEN } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        res.render(config.CLOSE_WHAT_WILL_HAPPEN, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(CLOSE_ACSP_BASE_URL, lang),
            currentUrl: CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN
        });
    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CLOSE_WHAT_WILL_HAPPEN, {
                ...pageProperties,
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(CLOSE_ACSP_BASE_URL, lang),
                currentUrl: CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN
            });
        } else {
            res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, lang));
        }
    } catch (err) {
        next(err);
    }
};
