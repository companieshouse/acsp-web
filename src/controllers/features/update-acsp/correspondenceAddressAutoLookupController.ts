import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import {
    UPDATE_CORRESPONDENCE_ADDRESS_MANUAL,
    UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_LIST,
    UPDATE_ACSP_DETAILS_BASE_URL,
    UPDATE_YOUR_ANSWERS
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP;

        let payload;
        if (acspUpdatedFullProfile.type === "sole-trader") {
            payload = {
                postCode: acspUpdatedFullProfile.registeredOfficeAddress?.postalCode,
                premise: acspUpdatedFullProfile.registeredOfficeAddress?.premises
            };
        } else {
            payload = {
                postCode: acspUpdatedFullProfile.serviceAddress?.postalCode,
                premise: acspUpdatedFullProfile.serviceAddress?.premises
            };
        }

        res.render(config.AUTO_LOOKUP_ADDRESS, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload,
            correspondenceAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, lang)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const lang = selectLang(req.query.lang);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP;
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
                correspondenceAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, lang)
            });
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            const addressLookUpService = new AddressLookUpService();
            addressLookUpService.processAddressFromPostcodeUpdateJourney(req, postcode, inputPremise, acspUpdatedFullProfile, acspUpdatedFullProfile.type === "sole-trader",
                UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LIST).then(async (nextPageUrl) => {

                session.setExtraData(ACSP_DETAILS_UPDATED, acspUpdatedFullProfile);
                res.redirect(nextPageUrl);
            }).catch(() => {
                const validationError : ValidationError[] = [{
                    value: postcode,
                    msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                    param: "postCode",
                    location: "body"
                }];
                const pageProperties = getPageProperties(formatValidationError(validationError, lang));
                res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
                    previousPage,
                    ...getLocaleInfo(locales, lang),
                    currentUrl,
                    pageProperties: pageProperties,
                    payload: req.body,
                    correspondenceAddressManualLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, lang)
                });
            });
        }
    } catch (err) {
        next(err);
    }
};
