import { NextFunction, Request, Response } from "express";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import * as config from "../../../config";
import { BASE_URL, CLOSE_ACSP_BASE_URL, MUST_BE_AUTHORISED_AGENT, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        let baseUrl;
        if (req.originalUrl.includes(UPDATE_ACSP_DETAILS_BASE_URL)) {
            baseUrl = UPDATE_ACSP_DETAILS_BASE_URL;
        } else if (req.originalUrl.includes(CLOSE_ACSP_BASE_URL)) {
            baseUrl = CLOSE_ACSP_BASE_URL;
        }

        res.render(config.MUST_BE_AUTHORISED_AGENT, {
            ...getLocaleInfo(locales, lang),
            currentUrl: baseUrl + MUST_BE_AUTHORISED_AGENT,
            registerAsAcspLink: addLangToUrl(BASE_URL, lang)
        });
    } catch (error) {
        next(error);
    }
};
