import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST, SOLE_TRADER_AUTO_LOOKUP_ADDRESS } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
        title: "What is your name?",
        ...getLocaleInfo(locales, lang),
        currentUrl: SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
        previousPage: addLangToUrl(SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
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
                currentUrl: SOLE_TRADER_AUTO_LOOKUP_ADDRESS_LIST,
                previousPage: addLangToUrl(SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang),
                pageProperties: pageProperties,
                addresses: req.session.user.addressList
            });
        } else {
            res.redirect("/sole-trader/correspondance-address-confirm");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
