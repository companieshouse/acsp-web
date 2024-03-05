import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { Company } from "../../../model/Company";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY, BASE_URL } from "../../../types/pageURL";
import { COMPANY_DETAILS } from "../../../common/__utils/constants";
export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    // Retrieve company details from the session
    const session: Session = req.session as any as Session;
    const company : Company = session?.getExtraData(COMPANY_DETAILS)!;
    res.render(config.LIMITED_IS_THIS_YOUR_COMPANY, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        title: "Is this your company?",
        company,
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
    });
};
