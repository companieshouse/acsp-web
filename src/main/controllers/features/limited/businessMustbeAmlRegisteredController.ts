import { NextFunction, Request, Response, Router } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, LIMITED_NAME_REGISTERED_WITH_AML, SOLE_TRADER_TYPE_OF_BUSINESS, AML_REGISTRATION } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang),
        soleTrader: addLangToUrl(BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS + "?typeOfBusiness=SOLE_TRADER", lang),
        amlRegistration: addLangToUrl(AML_REGISTRATION, lang),
        title: "business must be AML registered",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED
    });
};