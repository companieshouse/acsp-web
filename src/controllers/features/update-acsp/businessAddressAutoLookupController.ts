import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    UPDATE_YOUR_ANSWERS,
    UPDATE_BUSINESS_ADDRESS_MANUAL,
    UPDATE_BUSINESS_ADDRESS_LOOKUP,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_BUSINESS_ADDRESS_LIST,
    UPDATE_ACSP_DETAILS_BASE_URL
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED, AML_REMOVAL_BODY, AML_REMOVAL_INDEX } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { formatValidationError, getPageProperties } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const locales = getLocalesService();
        const lang = selectLang(req.query.lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const updateInProgress: Address | undefined = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        const payload = {
            postCode: updateInProgress ? updateInProgress.postalCode : acspUpdatedFullProfile.registeredOfficeAddress.postalCode,
            premise: updateInProgress ? updateInProgress.premises : acspUpdatedFullProfile.registeredOfficeAddress.premises
        };

        // Delete the temporary AML removal index and body from the session
        // Prevents the removed AML details from clearing on Your Updates view
        session.deleteExtraData(AML_REMOVAL_INDEX);
        session.deleteExtraData(AML_REMOVAL_BODY);

        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload,
            businessAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL, lang),
            typeOfBusiness: acspUpdatedFullProfile.type
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP;
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                businessAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL, lang),
                typeOfBusiness: acspUpdatedFullProfile.type
            });
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.processAddressFromPostcodeUpdateJourney(req, postcode, inputPremise,
                UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_LIST).then(async (nextPageUrl) => {

                res.redirect(nextPageUrl);
            }).catch((error) => {
                const validationError = addressLookUpService.getErrorMessage(error, postcode);
                const pageProperties = getPageProperties(formatValidationError([validationError], lang));
                res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
                    previousPage,
                    ...getLocaleInfo(locales, lang),
                    currentUrl,
                    pageProperties: pageProperties,
                    payload: req.body,
                    businessAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL, lang),
                    typeOfBusiness: acspUpdatedFullProfile.type
                });
            });
        }
    } catch (err) {
        next(err);
    }
};
