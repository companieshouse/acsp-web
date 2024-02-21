import { NextFunction, Request, Response, Router } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, SOLE_TRADER_TYPE_OF_BUSINESS, AML_REGISTRATION } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_HOW_ARE_YOU_AML_SUPERVISED, lang),
        soleTrader: addLangToUrl(BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS + "?typeOfBusiness=soleTrader", lang),
        amlRegistration: addLangToUrl(AML_REGISTRATION, lang),
        title: "business must be AML registered",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED
    });
};
