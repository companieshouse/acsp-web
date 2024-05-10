import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, LIMITED_NAME_REGISTERED_WITH_AML, TYPE_OF_BUSINESS, AML_REGISTRATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    session.setExtraData("typeOfBusinessService", "SOLE_TRADER");

    res.render(config.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang),
        soleTrader: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
        amlRegistration: addLangToUrl(AML_REGISTRATION, lang),
        title: "Your business must be registered with an AML supervisory body",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT
    });
};
