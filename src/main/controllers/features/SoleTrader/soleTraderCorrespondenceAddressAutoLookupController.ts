import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";
import * as config from "../../../config";
import { POSTCODE_ADDRESSES_LOOKUP_URL } from "../../../../utils/properties";
import { getUKAddressesFromPostcode } from "../../../services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";
import { getCountryFromKey } from "../../../../utils/web";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, {
        title: "What is your correspondence address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
        previousPage: addLangToUrl(SOLE_TRADER_WHERE_DO_YOU_LIVE, lang),
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName
    });

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_AUTO_LOOKUP_ADDRESS, {
                title: "What is your correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: SOLE_TRADER_AUTO_LOOKUP_ADDRESS,
                previousPage: addLangToUrl(SOLE_TRADER_WHERE_DO_YOU_LIVE, lang),
                pageProperties: pageProperties,
                payload: req.body,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            let postcode = req.body.postCode;
            postcode = postcode.replace(/\s/g, "");
            const ukAddresses: UKAddress[] = await getUKAddressesFromPostcode(POSTCODE_ADDRESSES_LOOKUP_URL, postcode);
            const correspondencePremise = req.body.premise;

            if (correspondencePremise !== "") {
                let address = {};
                for (const ukAddress of ukAddresses) {
                    if (ukAddress.premise.toUpperCase() === correspondencePremise.toUpperCase()) {
                        address = {
                            premise: ukAddress.premise,
                            addressLine1: ukAddress.addressLine1,
                            addressLine2: ukAddress.addressLine2,
                            locality: ukAddress.postTown,
                            postalCode: ukAddress.postcode,
                            country: getCountryFromKey(ukAddress.country)
                        };
                    }
                }
                req.session.user.address = address;
                req.session.save(() => {
                    res.redirect("/sole-trader/correspondence-address-confirm");
                });

            } else {

                const addressList = [];
                for (const ukAddress of ukAddresses) {
                    const address = {
                        premise: ukAddress.premise,
                        formattedAddress: ukAddress.premise + ", " + ukAddress.addressLine1 + ", " + ukAddress.postTown + ", " + getCountryFromKey(ukAddress.country) + ", " + ukAddress.postcode
                    };

                    addressList.push(address);

                }

                req.session.user.addressList = addressList;
                req.session.save(() => {
                    res.redirect("/sole-trader/correspondence-address-list");
                });

            }

        }
    } catch (error) {
        next(error);
    }

};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
