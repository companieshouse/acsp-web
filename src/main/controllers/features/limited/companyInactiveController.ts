import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_COMPANY_INACTIVE, START, BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const companyName = "MORRIS ACCOUNTING LTD";
    res.render(config.LIMITED_COMPANY_INACTIVE, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        startPage: addLangToUrl(BASE_URL, lang),
        title: "Which name is registered with your AML supervisory body?",
        companyName,
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_COMPANY_INACTIVE
    });
};
