import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import * as config from "../../../config";
import { AddressLookUpService } from "../../../services/address/addressLookUp";
import { getAddressFromPostcode } from "../../../services/postcode-lookup-service";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_BUSINESS_ADDRESS_LIST, UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
        title: "What is your business address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
        businessName: acspData?.businessName,
        businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
                title: "What is your business address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
                pageProperties: pageProperties,
                payload: req.body,
                businessName: acspData?.businessName,
                businessAddressManualLink: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_MANUAL, lang)
            });
        } else {
            const postcode = req.body.postCode;
            const inputPremise = req.body.premise;
            getAddressFromPostcode(postcode).then((ukAddresses) => {
                const addressLookUpService = new AddressLookUpService();
                if (inputPremise !== "" && ukAddresses.find((address) => address.premise === inputPremise)) {
                    addressLookUpService.saveBusinessAddressToSession(req, ukAddresses, inputPremise);
                    const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, lang);
                    res.redirect(nextPageUrl);
                } else {
                    addressLookUpService.saveAddressListToSession(req, ukAddresses);
                    const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LIST, lang);
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
                res.status(400).render(config.UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, {
                    previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
                    title: "What is your business address?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP,
                    businessName: acspData?.businessName,
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
