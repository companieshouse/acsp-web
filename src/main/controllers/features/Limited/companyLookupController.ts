import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { ACSPServiceClient } from "../../../clients/ASCPServiceClient";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_CONFIRM_COMPANY, LIMITED_ONE_LOGIN_PASSWORD,LIMITED_COMPANY_NUMBER } from "../../../types/pageURL";

const acspServiceClientOne = new ACSPServiceClient("http://localhost:18642/acsp-api");

export const get = async (req: Request, res: Response,next: NextFunction) => {
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
        //const errors = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                previousPage:addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
                payload: req.body,
                title: "What is the company number?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_COMPANY_NUMBER,
                pageProperties:pageProperties
                
                
            });
        } else {
            const { companyNumber } = req.body;
            await acspServiceClientOne.getCompany(companyNumber);
            res.redirect(BASE_URL + LIMITED_CONFIRM_COMPANY);
            const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_CONFIRM_COMPANY, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
        /*res.status(404).render(config.LIMITED_COMPANY_NUMBER, {

            payload: req.body,
            title: "What is the company number?",
            previousPage: BASE_URL + LIMITED_ONE_LOGIN_PASSWORD
        });*/
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
