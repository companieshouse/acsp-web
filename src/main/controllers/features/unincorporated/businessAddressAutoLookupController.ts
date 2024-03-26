import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BUSINESS_NAME } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { getAddressFromPostcode, getUKAddressesFromPostcode } from "../../../services/postcode-lookup-service";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHICH_SECTOR } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const businessName = session?.getExtraData(BUSINESS_NAME);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
        title: "What is your business address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
        businessName: businessName,
        businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const businessName = session?.getExtraData(BUSINESS_NAME);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
                title: "What is your business address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
                businessName: businessName,
                businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang),
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            getAddressFromPostcode(postcode).then((ukAddresses) => {
                const addressLookUpService = new AddressLookUpService();
                if (inputPremise !== "" && ukAddresses.find((address) => address.premise === inputPremise)) {
                    addressLookUpService.saveAddressToSession(req, ukAddresses, inputPremise);
                    res.redirect(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM);
                } else {
                    addressLookUpService.saveAddressListToSession(req, ukAddresses);
                    const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST, lang);
                    res.redirect(nextPageUrl);
                }
            }).catch((error) => {
                const pageProperties = getPageProperties(formatValidationError(error, lang));
                res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
                    previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
                    title: "What is your business address?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
                    businessName: businessName,
                    businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang),
                    pageProperties: pageProperties,
                    payload: req.body
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
