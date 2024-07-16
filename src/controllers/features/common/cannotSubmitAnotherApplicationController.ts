import { NextFunction, Request, Response } from "express";
import { BASE_URL, CANNOT_SUBMIT_ANOTHER_APPLICATION, YOUR_FILINGS } from "../../../types/pageURL";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.render(config.CANNOT_SUBMIT_ANOTHER_APPLICATION, {
        ...getLocaleInfo(getLocalesService(), lang),
        currentUrl: BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION,
        filingsLink: YOUR_FILINGS,
        previousPage: addLangToUrl(BASE_URL, lang)
    });
};
