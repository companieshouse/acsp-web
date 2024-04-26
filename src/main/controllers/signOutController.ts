import { NextFunction, Request, Response } from "express";
import logger, { createAndLogErrorRequest } from "../../../lib/Logger";
import * as config from "../config";
import { getPreviousPageUrl } from "../services/url";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../utils/localise";
import { BASE_URL, SIGN_OUT_URL } from "../types/pageURL";

export const get = (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    try {
        logger.debugRequest(req, `GET ${config.SIGN_OUT_PAGE}`);

        const previousPageUrl = getPreviousPageUrl(req, BASE_URL);

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

    try {
        logger.debugRequest(req, `POST ${config.SIGN_OUT_PAGE}`);
        const previousPageUrl = getPreviousPageUrl(req, BASE_URL);
        const previousPage = req.body.previousPage;

        if (!previousPage.startsWith(BASE_URL)) {
            throw createAndLogErrorRequest(req, `${previousPage} page is not part of the journey!`);
        }

        if (req.body.sign_out === "yes") {
            logger.info("----------------------------------------" + SIGN_OUT_URL);
            res.redirect(SIGN_OUT_URL);
        } else {
            logger.info("+++++++===========+++++" + previousPageUrl);
            res.redirect(previousPageUrl);

            // res.render(config.SIGN_OUT_PAGE, {
            //     title: "What is your role in the business?",
            //     ...getLocaleInfo(locales, lang),
            //     previousPage: addLangToUrl(previousPageUrl, lang),
            //     currentUrl: BASE_URL + SIGN_OUT_URL
            // });
        }

    } catch (error) {
        next(error);
    }
};
