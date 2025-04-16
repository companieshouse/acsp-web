import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
    LIMITED_CORRESPONDENCE_ADDRESS_LIST, LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang);
    const currentUrl: string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP;

    try {
        // get data from mongo
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            postCode: acspData.applicantDetails?.correspondenceAddress?.postalCode,
            premise: acspData.applicantDetails?.correspondenceAddress?.premises
        };

        res.render(config.AUTO_LOOKUP_ADDRESS, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            payload,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang);
    const currentUrl: string = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP;
    const locales = getLocalesService();
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
        const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
        res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            pageProperties: pageProperties,
            payload: req.body,
            businessName: acspData?.businessName,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
        });
    } else {
        const postcode = req.body.postCode;
        const inputPremise = req.body.premise;
        const addressLookUpService = new AddressLookUpService();
        addressLookUpService.getAddressFromPostcode(req, postcode, inputPremise, acspData, false,
            LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, LIMITED_CORRESPONDENCE_ADDRESS_LIST).then(async (nextPageUrl) => {
            try {
                // save data to mongodb
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
                res.redirect(nextPageUrl);
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
                next(err);
            }
        }).catch((error) => {
            let validationError: ValidationError;

            if (error.message === "correspondenceLookUpAddressWithoutCountry") {
                validationError = {
                    value: postcode,
                    msg: "correspondenceLookUpAddressWithoutCountry",
                    param: "postCode",
                    location: "body"
                };
            } else {
                validationError = {
                    value: postcode,
                    msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                    param: "postCode",
                    location: "body"
                };
            }
            const pageProperties = getPageProperties(formatValidationError([validationError], lang));
            res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
            });
        });
    }
};
