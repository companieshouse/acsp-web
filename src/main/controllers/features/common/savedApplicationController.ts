import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SAVED_APPLICATION, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SAVED_APPLICATION, {
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL, lang),
        currentUrl: BASE_URL + SAVED_APPLICATION
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
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL, lang),
                currentUrl: BASE_URL + SAVED_APPLICATION,
                ...pageProperties
            });
        } else {
            if (req.body.savedApplication === "yes") {
                saveDataInSession(req, "resume_application", true);
                res.redirect((YOUR_FILINGS));
            } else {
                saveDataInSession(req, "resume_application", false);
                res.redirect((BASE_URL + TYPE_OF_BUSINESS));
            }
        }
    } catch (error) {
        next(error);
    }

};
