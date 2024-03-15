import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { CompanyDetailsService } from "../../../services/company-details/companyDetailsService";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_ONE_LOGIN_PASSWORD, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../types/pageURL";
import { CompanyLookupService } from "../../../services/companyLookupService";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../../../../lib/Logger";

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
            logger.info("------------in if------------- " + JSON.stringify(errorList.array()));
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
            logger.info("------------in else-------------");
            const { companyNumber } = req.body;
            const companyLookupService = new CompanyLookupService();
            try {
                getCompanyDetails(companyLookupService, session, companyNumber, req).then(
                    (result) => {
                        if (!res.headersSent) {
                            const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
                            res.redirect(nextPageUrl);
                        }
                    }).catch(() => {
                    logger.info("------------in error-------------");
                    const errors = { errorList: [] } as any;
                    const errorMessage = "Enter a valid company number";
                    // errors.errorList[] relates to the linked error messages at the top of the page
                    errors.errorList.push({ href: "#companyNumber", text: errorMessage });
                    // errors[] relates to the highlighed fields and the message just above those fields
                    errors.companyNumber = { text: errorMessage };
                    res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                        previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
                        payload: req.body,
                        title: "What is the company number?",
                        ...getLocaleInfo(locales, lang),
                        currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER,
                        pageProperties: errors.companyNumber
                    });
                });
            } catch (error) {
                logger.info("------------in catch-------------");
                const errors = { errorList: [] } as any;
                const errorMessage = "Enter a valid company number";
                // errors.errorList[] relates to the linked error messages at the top of the page
                errors.errorList.push({ href: "#companyNumber", text: errorMessage });
                // errors[] relates to the highlighed fields and the message just above those fields
                errors.companyNumber = { text: errorMessage };
                res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                    previousPage: addLangToUrl(BASE_URL + LIMITED_ONE_LOGIN_PASSWORD, lang),
                    payload: req.body,
                    title: "What is the company number?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER,
                    pageProperties: errors.companyNumber

                });
            }
        }
    } catch (error : any) {
        if (error.response) {
            const errorMessage = Buffer.from(error.response.data).toString("utf-8");
            res.status(error.response.status).json({
                errors: [errorMessage]
            });
        } else {
            res.status(500).json({
                errors: [error.message]
            });
        }
        next(error);

    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

async function getCompanyDetails (companyLookupService: CompanyLookupService, session: Session, companyNumber: string, req: Request) {
    logger.info("------------going to get company details-------------");
    await companyLookupService.getCompany(session, companyNumber).then(
        (companyDetails) => {
            logger.info("------------got company details-------------");
            companyDetailsService.saveToSession(req, companyDetails); // Prints "Success: The promise has successfully resolved!"
        },
        (error) => {
            logger.info("------------error in getting company details-------------");
            Promise.reject(error);
        }

    );
}
