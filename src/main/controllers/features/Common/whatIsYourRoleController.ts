import { NextFunction, Request, Response, Router } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SOLE_TRADER, LIMITED, WHAT_IS_YOUR_ROLE, SOLE_TRADER_TYPE_OF_BUSINESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    console.log("reached");
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    req.session.user = req.session.user || {};
    var acspType = req.session.user.acspType;
    var currentUrl = "";
    if (acspType === "SOLE_TRADER") {
        currentUrl = BASE_URL + SOLE_TRADER + WHAT_IS_YOUR_ROLE;
    } else if (acspType === "LIMITED_COMPANY") {
        currentUrl = BASE_URL + LIMITED + WHAT_IS_YOUR_ROLE;
    };
    console.log("current url is:", currentUrl);
    res.render(config.WHAT_IS_YOUR_ROLE, {
        previousPage: addLangToUrl(SOLE_TRADER_TYPE_OF_BUSINESS, lang),
        title: "What is your role",
        ...getLocaleInfo(locales, lang),
        currentUrl: currentUrl,
        acspType: acspType,
        companyName: "MORRIS",
        companyNumber: "12345"
    });
};
