import { NextFunction, Request, Response } from "express";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import * as config from "../../../config";
import { BASE_URL, MUST_BE_AUTHORISED_AGENT } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        res.render(config.MUST_BE_AUTHORISED_AGENT, {
            ...getLocaleInfo(locales, lang),
            currentUrl: BASE_URL + MUST_BE_AUTHORISED_AGENT,
            registerAsAcspLink: addLangToUrl(BASE_URL, lang)
        });
    } catch (error) {
        next(error);
    }
};
