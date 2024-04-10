import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, BASE_URL } from "../../../types/pageURL";
import { Address } from "../../../model/Address";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, ADDRESS_LIST } from "../../../common/__utils/constants";
import { CorrespondenceAddressManualService } from "../../../../main/services/correspondence-address/correspondence-address-manual";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
    const payload = {
        addressPropertyDetails: acspData?.address?.propertyDetails,
        addressLine1: acspData?.address?.line1,
        addressLine2: acspData?.address?.line2,
        addressTown: acspData?.address?.town,
        addressCounty: acspData?.address?.county,
        addressCountry: acspData?.address?.country,
        addressPostcode: acspData?.address?.postcode
    };
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
        title: "Enter the correspondence address",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        currentUrl: BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        payload: payload
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData: ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                title: "Enter the correspondence address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName
            });
        } else {
            // Save the correspondence address to session
            const addressManualservice = new CorrespondenceAddressManualService();
            addressManualservice.saveCorrespondenceManualAddress(req);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
