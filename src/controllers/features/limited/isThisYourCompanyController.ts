import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY, LIMITED_COMPANY_INACTIVE, LIMITED_WHAT_IS_YOUR_ROLE, BASE_URL } from "../../../types/pageURL";
import { COMPANY_DETAILS, SUBMISSION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { CompanyDetailsService } from "../../../services/company-details/companyDetailsService";
import { AcspDataService } from "../../../services/acspDataService";
import { Company } from "../../../model/Company";

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
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY;
    try {
        const session: Session = req.session as any as Session;
        const company: Company = session?.getExtraData(COMPANY_DETAILS)!;
        const companyDetailsService = new CompanyDetailsService();
        const status = company?.status;
        if (companyDetailsService.capFirstLetter(status || " ") === "Active") {
            // update acspData
            const acspData: AcspData = session.getExtraData(USER_DATA)!;
            if (acspData) {
                acspData.businessAddress = {
                    addressLine1: company.registeredOfficeAddress?.addressLineOne!,
                    addressLine2: company.registeredOfficeAddress?.addressLineTwo!,
                    locality: company.registeredOfficeAddress?.locality!,
                    region: company.registeredOfficeAddress?.region!,
                    country: company.registeredOfficeAddress?.country!,
                    postalCode: company.registeredOfficeAddress?.postalCode!
                };
                acspData.companyDetails = {
                    companyName: company.companyName,
                    companyNumber: company.companyNumber
                };
                acspData.businessName = company.companyName;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            // Redirect to next page
            res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang));
        } else {
            res.redirect(addLangToUrl(BASE_URL + LIMITED_COMPANY_INACTIVE, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
