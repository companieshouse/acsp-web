import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { CLOSE_ACSP_BASE_URL, CLOSE_ACSP } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { REQ_TYPE_CLOSE_ACSP } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const reqType = REQ_TYPE_CLOSE_ACSP;

    res.render(config.CLOSE_ACSP_HOME, {
        ...getLocaleInfo(locales, lang),
        reqType,
        currentUrl: CLOSE_ACSP_BASE_URL
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_ACSP, lang));
};
