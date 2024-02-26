import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, BASE_URL } from "../../../types/pageURL";
import { Address } from "../../../model/Address";
import { UserData } from "../../../model/UserData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const userData : UserData = session.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        currentUrl: BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
        firstName: userData.firstName,
        lastName: userData.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: userData.firstName,
                lastName: userData.lastName
            });
        } else {
            // Save the correspondence address to session
            const correspondenceAddress : Address = {
                propertyDetails: req.body.addressPropertyDetails,
                line1: req.body.addressLine1,
                line2: req.body.addressLine2,
                town: req.body.addressTown,
                county: req.body.addressCounty,
                country: req.body.addressCountry,
                postcode: req.body.addressPostcode
            };
            const userAddress : Array<Address> = userData.addresses ? userData.addresses : [];
            userAddress.push(correspondenceAddress);
            userData.addresses = userAddress;
            saveDataInSession(req, USER_DATA, userData);
            res.redirect(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
