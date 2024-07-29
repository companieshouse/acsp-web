import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_COMPANY_INACTIVE, BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../../../common/__utils/constants";
import { Company } from "../../../model/Company";

export const get = async (req: Request, res: Response, next: NextFunction) => {

    const session: Session = req.session as any as Session;
    const company : Company = session?.getExtraData(COMPANY_DETAILS)!;

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    res.render(config.LIMITED_COMPANY_INACTIVE, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        feedbackLink: "https://www.smartsurvey.co.uk/s/reg-as-acsp-co-not-active/",
        startPage: addLangToUrl(BASE_URL, lang),
        companyName: company?.companyName,
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_COMPANY_INACTIVE
    });
};
