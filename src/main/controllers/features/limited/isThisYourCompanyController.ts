import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { Company } from "../../../model/Company";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_COMPANY_INACTIVE, LIMITED_WHAT_IS_YOUR_ROLE, BASE_URL } from "../../../types/pageURL";
import { ANSWER_DATA, COMPANY_DETAILS, SUBMISSION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const company : Company = session?.getExtraData(COMPANY_DETAILS)!;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.LIMITED_IS_THIS_YOUR_COMPANY, {
            previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
            chooseDifferentCompany: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
            title: "Is this your company?",
            company,
            ...getLocaleInfo(locales, lang),
            currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        res.status(400).render(config.ERROR_404, {
            previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
            title: "Page not found",
            ...getLocaleInfo(locales, lang),
            currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
        });
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const company: Company = session?.getExtraData(COMPANY_DETAILS)!;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;
        if (acspData) {
            acspData.companyDetails = company;
        }
        try {
            //  save data to mongodb
            const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

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
        } catch (err) {
            logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
            logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
            res.status(400).render(config.ERROR_404, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang),
                title: "Page not found",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY
            });
        }
    } catch (error) {
        next(error);
    }
};
