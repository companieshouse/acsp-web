import { NextFunction, Request, Response } from "express";
import { BASE_URL, PAYMENT_FAILED, YOUR_FILINGS } from "../../../types/pageURL";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";

export const get = (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.render(config.PAYMENT_FAILED, {
        ...getLocaleInfo(getLocalesService(), lang),
        currentUrl: BASE_URL + PAYMENT_FAILED,
        previousPage: addLangToUrl(BASE_URL, lang),
        yourFilingsUrl: YOUR_FILINGS
    });
};
