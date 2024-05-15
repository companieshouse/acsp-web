import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_COMPANY_INACTIVE, LIMITED_WHAT_IS_YOUR_ROLE, BASE_URL } from "../../../types/pageURL";
import { ANSWER_DATA, COMPANY_DETAILS, SUBMISSION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData, Company } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { ACSPData } from "../../../../main/model/ACSPData";
import { CompanyDetailsService } from "../../../../main/services/company-details/companyDetailsService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const company : Company = session?.getExtraData(COMPANY_DETAILS)!;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang);
    const currentUrl: string = BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.LIMITED_IS_THIS_YOUR_COMPANY, {
            previousPage,
            chooseDifferentCompany: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
            title: "Is this your company?",
            company,
            ...getLocaleInfo(locales, lang),
            currentUrl
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const locales = getLocalesService();
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang);
        const currentUrl: string = BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY;
        const company: Company = session?.getExtraData(COMPANY_DETAILS)!;
        const companyDetailsService = new CompanyDetailsService();
        const status = company?.status;
        if (companyDetailsService.capFirstLetter(status || " ") === "Active") {
            // update acspData
            const acspData: AcspData = session.getExtraData(USER_DATA)!;
            if (acspData) {
                acspData.businessAddress = {
                    line1: company.registeredOfficeAddress?.addressLineOne!,
                    line2: company.registeredOfficeAddress?.addressLineTwo!,
                    town: company.registeredOfficeAddress?.locality!,
                    county: company.registeredOfficeAddress?.region!,
                    country: company.registeredOfficeAddress?.country!,
                    postcode: company.registeredOfficeAddress?.postalCode!
                };
                acspData.companyDetails = company;
                acspData.businessName = company.companyName;
            }
            try {
                //  save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

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
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, currentUrl);
            }
        } else {
            res.redirect(addLangToUrl(BASE_URL + LIMITED_COMPANY_INACTIVE, lang));
        }
    } catch (error) {
        next(error);
    }
};
