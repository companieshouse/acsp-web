import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import {
    selectLang,
    addLangToUrl,
    getLocalesService,
    getLocaleInfo
} from "../../../utils/localise";
import {
    LIMITED_WHAT_IS_THE_COMPANY_NUMBER,
    LIMITED_COMPANY_INACTIVE,
    BASE_URL
} from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY } from "../../../common/__utils/constants";
import { Company } from "../../../model/Company";

/**
 * Handles GET request for displaying Limited Company Inactive page.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve session data and company details
    const session: Session = req.session as any as Session;
    const company : Company = session?.getExtraData(COMPANY)!;

    // Select language and locales
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    // Render Limited Company Inactive page with data
    res.render(config.LIMITED_COMPANY_INACTIVE, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        startPage: addLangToUrl(BASE_URL, lang),
        title: "Company is not active",
        companyName: company?.companyName,
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_COMPANY_INACTIVE
    });
};
