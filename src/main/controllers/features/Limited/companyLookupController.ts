import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { CompanyDetailsService } from "../../../services/company-details/companyDetailsService";
import * as config from "../../../config";
import { ACSPServiceClient } from "../../../clients/ASCPServiceClient";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_ONE_LOGIN_PASSWORD, LIMITED_COMPANY_NUMBER } from "../../../types/pageURL";

const acspServiceClientOne = new ACSPServiceClient("http://localhost:18642/acsp-api");
const companyDetailsService = new CompanyDetailsService();

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.LIMITED_COMPANY_NUMBER, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
        title: "What is the company number?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_COMPANY_NUMBER
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const errors = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const { companyNumber } = req.body;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
                payload: req.body,
                title: "What is the company number?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_COMPANY_NUMBER,
                pageProperties: pageProperties

            });
        } else {
            const { companyNumber } = req.body;
            const companyDetails = await acspServiceClientOne.getCompany(companyNumber);
            companyDetailsService.saveToSession(req, companyDetails);
            const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
