import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { CompanyLookupService } from "../../../services/companyLookupService";
import { formatValidationError, getPageProperties } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    res.render(config.LIMITED_COMPANY_NUMBER, {
        previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
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
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                payload: req.body,
                title: "What is the company number?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER,
                pageProperties: pageProperties

            });
        } else {
            const { companyNumber } = req.body;
            const companyLookupService = new CompanyLookupService();
            companyLookupService.getCompanyDetails(session, companyNumber, req).then(
                () => {
                    if (!res.headersSent) {
                        const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
                        res.redirect(nextPageUrl);
                    }
                }).catch(() => {
                const validationError : ValidationError[] = [{
                    value: companyNumber,
                    msg: "companyNumberDontExsits",
                    param: "companyNumber",
                    location: "body"
                }];
                const pageProperties = getPageProperties(formatValidationError(validationError, lang));

                res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                    previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
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
