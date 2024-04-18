import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { Company } from "../../../model/Company";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_COMPANY_INACTIVE, LIMITED_WHAT_IS_YOUR_ROLE, BASE_URL } from "../../../types/pageURL";
import { ANSWER_DATA, COMPANY_DETAILS } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";


export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const company : Company = session?.getExtraData(COMPANY_DETAILS)!;
    res.render(config.LIMITED_IS_THIS_YOUR_COMPANY, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        chooseDifferentCompany: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
        title: "Is this your company?",
        company,
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const company: Company = session?.getExtraData(COMPANY_DETAILS)!;
        if (company.status === "active") {
            // Save answers
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.businessName = company.companyName;
            detailsAnswers.companyNumber = company.companyNumber;
            detailsAnswers.businessAddress = company.registeredOfficeAddress?.addressLineOne! +
            "<br>" + company.registeredOfficeAddress?.country! +
            "<br>" + company.registeredOfficeAddress?.postalCode!;
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);
            // Redirect to next page
            res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang));
        } else {
            res.redirect(addLangToUrl(BASE_URL + LIMITED_COMPANY_INACTIVE, lang));
        }
    } catch (error) {
        next(error);
    }
};
