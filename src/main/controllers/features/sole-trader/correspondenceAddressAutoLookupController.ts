import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { getAddressFromPostcode } from "../../../services/postcode-lookup-service";
import { getCountryFromKey } from "../../../utils/web";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { Address } from "../../../model/Address";
import { ACSPData } from "../../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.AUTO_LOOKUP_ADDRESS, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
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
            res.status(400).render(config.AUTO_LOOKUP_ADDRESS, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
            });
        } else {
            const postcode = req.body.postCode;
            const correspondencePremise = req.body.premise;
            getAddressFromPostcode(postcode).then((ukAddresses) => {
                if (correspondencePremise !== "" && ukAddresses.find((address) => address.premise === correspondencePremise)) {
                    let address = {
                        premise: "",
                        addressLine1: "",
                        addressLine2: "",
                        postTown: "",
                        postalCode: "",
                        country: ""
                    };
                    for (const ukAddress of ukAddresses) {
                        if (ukAddress.premise === correspondencePremise) {
                            address = {
                                premise: ukAddress.premise,
                                addressLine1: ukAddress.addressLine1,
                                addressLine2: ukAddress.addressLine2!,
                                postTown: ukAddress.postTown,
                                postalCode: ukAddress.postcode,
                                country: getCountryFromKey(ukAddress.country)
                            };
                        }
                    }
                    // Save the correspondence address to session
                    const correspondenceAddress : Address = {
                        propertyDetails: address.premise,
                        line1: address.addressLine1,
                        line2: address.addressLine2,
                        town: address.postTown,
                        country: address.country,
                        postcode: address.postalCode
                    };
                    const userAddresses : Array<Address> = acspData?.addresses ? acspData.addresses : [];
                    userAddresses.push(correspondenceAddress);
                    acspData.addresses = userAddresses;
                    saveDataInSession(req, USER_DATA, acspData);
                    const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
                    res.redirect(nextPageUrl);

                } else {

                    const addressList : Array<Address> = [];
                    for (const ukAddress of ukAddresses) {
                        const address = {
                            propertyDetails: ukAddress.premise,
                            line1: ukAddress.addressLine1,
                            line2: ukAddress.addressLine2,
                            town: ukAddress.postTown,
                            country: getCountryFromKey(ukAddress.country),
                            postcode: ukAddress.postcode,
                            formattedAddress: ukAddress.premise + ", " + ukAddress.addressLine1 + ", " + ukAddress.postTown + ", " + getCountryFromKey(ukAddress.country) + ", " + ukAddress.postcode
                        };

                        addressList.push(address);

                    }
                    acspData.addresses = addressList;
                    saveDataInSession(req, USER_DATA, acspData);
                    const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, lang);
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
                    previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
                    title: "What is the correspondence address?",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
                    pageProperties: pageProperties,
                    payload: req.body,
                    firstName: acspData?.firstName,
                    lastName: acspData?.lastName,
                    correspondenceAddressManualLink: addLangToUrl(BASE_URL + SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, lang)
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
