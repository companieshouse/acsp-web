import { NextFunction, Request, Response } from "express";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    res.render(config.STOP_NOT_RELEVANT_OFFICER_KICK_OUT, {
        title: locales.i18nCh.resolveNamespacesKeys(lang).cannotUseServiceTitle,
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang),
        currentUrl: BASE_URL + STOP_NOT_RELEVANT_OFFICER
    });
};
