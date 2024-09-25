import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { USER_DATA, UNINCORPORATED_CORRESPONDENCE_ADDRESS, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, UNINCORPORATED_WHAT_IS_YOUR_EMAIL } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ErrorService } from "../../../services/errorService";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl: string = BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
    try {
        // get data from mongo and save to session
        const acspData: AcspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        // set addressoption to render the page with saved data
        let addressOption = "";
        const applicantDetails = acspData.applicantDetails || {};
        if (applicantDetails.correspondenceAddress !== null && applicantDetails.correspondenceAddress !== undefined) {
            if (JSON.stringify(applicantDetails.correspondenceAddress) === JSON.stringify(acspData.registeredOfficeAddress)) {
                addressOption = "CORRESPONDANCE_ADDRESS";
            } else {
                addressOption = "DIFFERENT_ADDRESS";
            }
        }

        res.render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            businessAddress: acspData?.registeredOfficeAddress,
            addressOption

        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
    try {
        const errorList = validationResult(req);
        const addressOption = req.body.addressSelectorRadio;
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties,
                businessName: acspData?.businessName,
                businessAddress: acspData?.registeredOfficeAddress,
                addressOption
            });
        } else {

            session.setExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS, addressOption);
            const acspDataService = new AcspDataService();
            const applicantDetails = acspData.applicantDetails || {};
            if (addressOption === "CORRESPONDANCE_ADDRESS") {
                //  save data to mongodb
                applicantDetails.correspondenceAddress = acspData.registeredOfficeAddress;
                applicantDetails.correspondenceAddressIsSameAsRegisteredOfficeAddress =
                      true;
                acspData.applicantDetails = applicantDetails;
                await acspDataService.saveAcspData(session, acspData);
                // redirect
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_EMAIL, lang));
            } else {
                if (applicantDetails.correspondenceAddress?.postalCode === acspData.registeredOfficeAddress?.postalCode) {
                    applicantDetails.correspondenceAddress = {};
                    applicantDetails.correspondenceAddressIsSameAsRegisteredOfficeAddress =
                      true;
                    acspData.applicantDetails = applicantDetails;
                    //  save data to mongodb
                    await acspDataService.saveAcspData(session, acspData);
                }
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
