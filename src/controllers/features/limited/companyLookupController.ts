import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { CompanyLookupService } from "../../../services/companyLookupService";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspData, Company } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
    const currentUrl = BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            companyNumber: acspData?.companyDetails?.companyNumber
        };

        res.render(config.LIMITED_COMPANY_NUMBER, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER;
    try {
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const previousPage = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));

            res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                previousPage,
                payload: req.body,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties

            });
        } else {
            const { companyNumber } = req.body;
            const companyLookupService = new CompanyLookupService();
            companyLookupService.getCompanyDetails(session, companyNumber, req).then(
                async () => {
                    if (!res.headersSent) {
                        const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang);
                        const acspData : AcspData = session?.getExtraData(USER_DATA)!;
                        const companyDetails: Company = { companyNumber: companyNumber };
                        if (acspData) {
                            acspData.companyDetails = companyDetails;
                        }
                        //  save data to mongodb
                        const acspDataService = new AcspDataService();
                        await acspDataService.saveAcspData(session, acspData);
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
                    previousPage,
                    payload: req.body,
                    title: "What is the company number?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl,
                    pageProperties: pageProperties
                });
            });
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
