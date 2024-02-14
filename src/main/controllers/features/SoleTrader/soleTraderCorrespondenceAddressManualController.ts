import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    req.session.user = req.session.user || {};
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
        title: "What is the correspondence address?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
        currentUrl: SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
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
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
                previousPage: addLangToUrl(SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            // Save the correspondence address to session
            req.session.user.correspondenceAddress = {
                propertyDetails: req.body.addressPropertyDetails,
                line1: req.body.addressLine1,
                line2: req.body.addressLine2,
                town: req.body.addressTown,
                county: req.body.addressCounty,
                country: req.body.addressCountry,
                postcode: req.body.addressPostcode
            };
            req.session.save(() => {
                res.redirect(SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
            });
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
