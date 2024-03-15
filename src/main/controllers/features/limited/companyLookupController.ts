import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { CompanyDetailsService } from "../../../services/company-details/companyDetailsService";
import { CompanyLookupService } from "../../../services/companyLookupService";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_ONE_LOGIN_PASSWORD, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";

const companyDetailsService = new CompanyDetailsService();

export const get = async (req: Request, res: Response, next: NextFunction) => {

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.LIMITED_COMPANY_NUMBER, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
        title: "What is the company number?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
                payload: req.body,
                title: "What is the company number?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER,
                pageProperties: pageProperties

            });
        } else {
            const { companyNumber } = req.body;
            const companyLookupService = new CompanyLookupService();
            getCompanyDetails(companyLookupService, session, companyNumber, req).then(
                (result) => {
                    if (!res.headersSent) {
                        const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
                        res.redirect(nextPageUrl);
                    }
                }).catch((error) => {
                const pageProperties = getPageProperties(formatValidationError(error, lang));
                res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                    previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
                    payload: req.body,
                    title: "What is the company number?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER,
                    pageProperties: pageProperties
                });
            });

        }
    } catch (error : any) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

async function getCompanyDetails (companyLookupService: CompanyLookupService, session: Session, companyNumber: string, req: Request) {
    await companyLookupService.getCompany(session, companyNumber).then(
        (companyDetails) => {
            companyDetailsService.saveToSession(req, companyDetails);
        }).catch((companyNumber) => {
        const validationError : ValidationError[] = [{
            value: companyNumber,
            msg: "companyNumberDontExsits",
            param: "companyNumber",
            location: "body"
        }]; ;
        throw validationError;
    });

}
