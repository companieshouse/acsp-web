import { NextFunction, Request, Response } from "express";
import * as config from "../config";
import { validationResult } from "express-validator";
import { getPreviousPageUrl } from "../services/url";
import { Session } from "@companieshouse/node-session-handler";
import { formatValidationError, getPageProperties } from "../validation/validation";
import { PREVIOUSPAGEURL } from "../common/__utils/constants";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../utils/localise";
import { BASE_URL, SIGN_OUT_URL } from "../types/pageURL";
import { saveDataInSession } from "../common/__utils/sessionHelper";

export const get = (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const previousPageUrl = getPreviousPageUrl(req, BASE_URL);
        saveDataInSession(req, PREVIOUSPAGEURL, previousPageUrl);
        res.render(config.SIGN_OUT_PAGE, {
            title: "Are you sure you want to sign out?",
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(previousPageUrl, lang),
            currentUrl: BASE_URL + SIGN_OUT_URL
        });
    } catch (error) {
        next(error);
    }
};

export const post = (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const previousPageUrl : string = session?.getExtraData(PREVIOUSPAGEURL)!;
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));

            res.render(config.SIGN_OUT_PAGE, {
                title: "Are you sure you want to sign out?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(previousPageUrl, lang),
                currentUrl: BASE_URL + SIGN_OUT_URL,
                ...pageProperties
            });
        } else {
            if (req.body.signout === "yes") {
                res.redirect(addLangToUrl(BASE_URL, lang));
            } else {
                res.redirect(addLangToUrl(previousPageUrl, lang));
            }
        }
    } catch (error) {
        next(error);
    }

};
