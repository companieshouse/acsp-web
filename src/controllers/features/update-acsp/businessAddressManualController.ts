import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UPDATE_BUSINESS_ADDRESS_CONFIRM, UPDATE_BUSINESS_ADDRESS_LOOKUP, UPDATE_BUSINESS_ADDRESS_MANUAL, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";
import { BusinessAddressService } from "../../../services/business-address/businessAddressService";
import { setPaylodForUpdateInProgress } from "../../../services/update-acsp/updateYourDetailsService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        let payload;
        // Get existing business address details and display on the page
        const businessAddressService = new BusinessAddressService();
        payload = businessAddressService.getBusinessManualAddress(acspUpdatedFullProfile);
        if (session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)) {
            const { premises, addressLine1, addressLine2, locality, region, country, postalCode } = setPaylodForUpdateInProgress(req);
            payload = {
                addressPropertyDetails: premises,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                addressTown: locality,
                addressCounty: region,
                countryInput: country,
                addressPostcode: postalCode
            };
        }
        res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            payload,
            typeOfBusiness: acspUpdatedFullProfile.type
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const lang = selectLang(req.query.lang);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_LOOKUP, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_MANUAL;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
                typeOfBusiness: acspUpdatedFullProfile.type
            });
        } else {
        // update acspUpdatedFullProfile
            const businessAddressService = new BusinessAddressService();
            businessAddressService.saveBusinessAddressUpdate(req, acspFullProfile.registeredOfficeAddress.country!);

            // Redirect to the address confirmation page
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_BUSINESS_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        next(err);
    }
};
