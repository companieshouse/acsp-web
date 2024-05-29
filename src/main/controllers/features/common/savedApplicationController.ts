import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SAVED_APPLICATION, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SAVED_APPLICATION, {
        title: "Do you want to continue with a saved application?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL, lang),
        currentUrl: SAVED_APPLICATION
    });
};

export const post = (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));

            res.render(config.SAVED_APPLICATION, {
                title: "Do you want to continue with a saved application?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL, lang),
                currentUrl: SAVED_APPLICATION,
                ...pageProperties
            });
        } else {
            if (req.body.savedApplication === "yes") {
                res.redirect((YOUR_FILINGS));
            } else {
                res.redirect((BASE_URL + TYPE_OF_BUSINESS));
            }
        }
    } catch (error) {
        next(error);
    }

};
