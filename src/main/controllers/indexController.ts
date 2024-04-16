import { NextFunction, Request, Response } from "express";
import * as config from "../config";
import { BASE_URL, TYPE_OF_BUSINESS } from "../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../utils/localise";

/**
 * Handler for GET request to the home page.
 * Renders the home page with relevant data.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    res.render(config.HOME, {
        title: "",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL
    });
};

/**
 * Handler for POST request from the home page.
 * Redirects to the next page based on user's language preference.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const nextPageUrl = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);

        res.redirect(nextPageUrl);
    } catch (error) {
        next(error);
    }
};
