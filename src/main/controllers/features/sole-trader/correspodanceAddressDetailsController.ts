import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { CORRESPONDENCE_ADDRESS, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { CorrespondenceAddressDetailsService } from "../../../services/correspondence-address/address-details";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
        title: "Select your address",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        addresses: acspData?.addresses,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
    }
    );
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const errorList = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
                title: "Select your address",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                pageProperties: pageProperties,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                addresses: acspData?.addresses
            });
        } else {

            const selectPremise = req.body.correspondenceAddress;
            CorrespondenceAddressDetailsService.saveCorrespondenceDetailsAddress(req, acspData, selectPremise);
            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
