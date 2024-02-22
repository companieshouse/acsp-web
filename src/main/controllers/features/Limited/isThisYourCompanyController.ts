import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY, BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    // Retrieve company details from the session
    const companyDetails = req.session.companyDetails || {};
    console.log(companyDetails);

    res.render(config.LIMITED_IS_THIS_YOUR_COMPANY, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        title: "Is this your company?",
        companyDetails, // Pass company details to the template
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
    });
};