import { NextFunction, Request, Response } from "express";
import * as config from "../config";
import { getPreviousPageUrl } from "../services/url";
import { Session } from "@companieshouse/node-session-handler";
import { PREVIOUSPAGEURL } from "../common/__utils/constants";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../utils/localise";
import { BASE_URL, SIGN_OUT_URL } from "../types/pageURL";
import { saveDataInSession } from "../common/__utils/sessionHelper";

export const get = (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    try {
        const previousPageUrl = getPreviousPageUrl(req, BASE_URL);
        const getpreviousPageUrl = req.body.previousPageUrl;
        saveDataInSession(req, PREVIOUSPAGEURL, getpreviousPageUrl);
        res.render(config.SIGN_OUT_PAGE, {
            title: "What is your role in the business?",
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(previousPageUrl, lang),
            currentUrl: BASE_URL + SIGN_OUT_URL
        });
    } catch (error) {
        next(error);
    }
};

export const post = (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPageUrl : string = session?.getExtraData(PREVIOUSPAGEURL)!;

    try {
        res.render(config.SIGN_OUT_PAGE, {
            title: "What is your role in the business?",
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(previousPageUrl, lang),
            currentUrl: BASE_URL + SIGN_OUT_URL
        });

        if (req.body.sign_out === "yes") {
            res.redirect(SIGN_OUT_URL);
        } else {
            res.redirect(previousPageUrl);
        }
    } catch (error) {
        next(error);
    }
};
