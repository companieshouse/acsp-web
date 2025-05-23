import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import {
    BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
    SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS
} from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS;

    try {
        // get data from mongo and save to session
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
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            payload,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS;
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
            firstName: acspData.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
        });
    } else {
        const postcode = req.body.postCode;
        const inputPremise = req.body.premise;
        const addressLookUpService = new AddressLookUpService();
        await addressLookUpService.getAddressFromPostcode(req, postcode, inputPremise, acspData, false,
            SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST).then(async (nextPageUrl) => {
            try {
                // save data to mongodb
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
                res.redirect(nextPageUrl);
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                next(err);
            }
        }).catch((error) => {
            const validationError = addressLookUpService.getErrorMessage(error, postcode);
            const pageProperties = getPageProperties(formatValidationError([validationError], lang));
            res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
            });
        });
    }
};
