import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { CompanyDetailsService } from "../../../services/company-details/companyDetailsService";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import logger from "../../../../../lib/Logger";
import { CHS_API_KEY } from "../../../utils/properties";
import { ACSP_SERVICE_BASE } from "../../../config";
import { CompanyLookupService } from "../../../services/companyLookupService";

const companyDetailsService = new CompanyDetailsService();

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
            const companyDetails = await companyLookupService.getCompany(companyNumber);
            companyDetailsService.saveToSession(req, companyDetails);
            if (!res.headersSent) {
                const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
                res.redirect(nextPageUrl);
            }

        }
    } catch (error) {
        next(error);

    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
