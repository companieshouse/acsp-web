import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { getAddressFromPostcode } from "../../../services/postcode-lookup-service";
import {
    BASE_URL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, UNINCORPORATED_ADDRESS_CORRESPONDENCE_SELECTOR,
    UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP
} from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.AUTO_LOOKUP_ADDRESS, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_ADDRESS_CORRESPONDENCE_SELECTOR, lang),
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_ADDRESS_CORRESPONDENCE_SELECTOR, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP,
                pageProperties: pageProperties,
                payload: req.body,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
            });
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            getAddressFromPostcode(postcode).then((ukAddresses) => {
                const addressLookUpService = new AddressLookUpService();
                if (inputPremise !== "" && ukAddresses.find((address) => address.premise === inputPremise)) {
                    addressLookUpService.saveCorrespondenceAddressToSession(req, ukAddresses, inputPremise);
                    const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
                    res.redirect(nextPageUrl);
                } else {
                    addressLookUpService.saveAddressListToSession(req, ukAddresses);
                    const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LIST, lang);
                    res.redirect(nextPageUrl);
                }
            }).catch(() => {
                const validationError : ValidationError[] = [{
                    value: postcode,
                    msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                    param: "postCode",
                    location: "body"
                }];
                const pageProperties = getPageProperties(formatValidationError(validationError, lang));
                res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
                    previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_ADDRESS_CORRESPONDENCE_SELECTOR, lang),
                    title: "What is the correspondence address?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP,
                    pageProperties: pageProperties,
                    payload: req.body,
                    correspondenceAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_MANUAL, lang)
                });
            });
        }
    } catch (error) {
        next(error);
    }

};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
