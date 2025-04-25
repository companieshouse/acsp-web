import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { CorrespondenceAddressManualService } from "../../../services/correspondence-address/correspondence-address-manual";
import { UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import countryList from "../../../../lib/countryListWithUKCountries";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";
import { setPaylodForUpdateInProgress } from "../../../services/update-acsp/updateYourDetailsService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        setPaylodForUpdateInProgress(req);
        // Get existing correspondence address details and display on the page
        let payload;
        const addressManualservice = new CorrespondenceAddressManualService();
        if (acspUpdatedFullProfile.type === "sole-trader") {
            payload = addressManualservice.getCorrespondenceManualAddressUpdate(acspUpdatedFullProfile.registeredOfficeAddress);
        } else {
            payload = addressManualservice.getCorrespondenceManualAddressUpdate(acspUpdatedFullProfile.serviceAddress);
        }
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
        res.render(config.CORRESPONDENCE_ADDRESS_MANUAL, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            countryList: countryList,
            payload
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL;
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CORRESPONDENCE_ADDRESS_MANUAL, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                countryList: countryList,
                pageProperties: pageProperties,
                payload: req.body,
                cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
            });
        } else {
        // update acspUpdatedFullProfile
            const addressManualservice = new CorrespondenceAddressManualService();
            addressManualservice.saveManualAddressUpdate(req);

            // Redirect to the address confirmation page
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (err) {
        next(err);
    }
};
