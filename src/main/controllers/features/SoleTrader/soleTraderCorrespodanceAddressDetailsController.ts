import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
        title: "Select your address?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        addresses: req.session.user.addressList
    }
    );
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    try {
        const errorList = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
                title: "What is your correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                pageProperties: pageProperties,
                addresses: req.session.user.addressList
            });
        } else {
            const addresList = req.session.user.addressList;
            const selectPremise = req.body.correspondenceAddress;

            for (const ukAddress of addresList) {
                if (ukAddress.premise.toUpperCase() === selectPremise.toUpperCase()) {
                    // Save the correspondence address to session
                    req.session.user.correspondenceAddress = {
                        propertyDetails: ukAddress.premise,
                        line1: ukAddress.line1,
                        line2: ukAddress.line2,
                        town: ukAddress.town,
                        country: ukAddress.country,
                        postcode: ukAddress.postcode
                    };

                }

            }
            req.session.save(() => {
                const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, lang);
                res.redirect(nextPageUrl);
            });
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
