import { NextFunction, Request, Response } from "express";
import * as config from "../config";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NAME, TYPE_OF_BUSINESS } from "../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../utils/localise";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.HOME, {
        title: "",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const nextPageUrl = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
        res.redirect(nextPageUrl);
    } catch (error) {
        next(error);
    }
};
