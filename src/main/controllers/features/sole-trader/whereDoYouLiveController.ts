import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../../lib/countryList";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
        title: "Where do you live?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, lang),
        currentUrl: BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE,
        countryList: countryList,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, lang),
                title: "Where do you live?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE,
                pageProperties: pageProperties,
                countryList: countryList
            });
        } else {
            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
