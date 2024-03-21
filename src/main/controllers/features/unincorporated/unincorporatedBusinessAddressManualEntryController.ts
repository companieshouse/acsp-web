import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, BASE_URL } from "../../../types/pageURL";
import { Address } from "../../../model/Address";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspdata : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY, {
        title: "Enter the business address",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY,
        businessName: acspdata.companyDetails?.companyName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspdata : ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang),
                title: "Enter the business address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL_ENTRY,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: acspdata.companyDetails?.companyName
            });
        } else {
            // Save the correspondence address to session
            const businessAddress : Address = {
                propertyDetails: req.body.addressPropertyDetails,
                line1: req.body.addressLine1,
                line2: req.body.addressLine2,
                town: req.body.addressTown,
                county: req.body.addressCounty,
                country: req.body.addressCountry,
                postcode: req.body.addressPostcode
            };
            const companyDetails = acspdata.companyDetails ? acspdata.companyDetails : {};
            companyDetails.registeredOfficeAddress = businessAddress;
            acspdata.companyDetails = companyDetails;
            if (session) {
                session.setExtraData(USER_DATA, acspdata);
            }
            res.redirect(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
