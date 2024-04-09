import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { USER_DATA } from "../../../common/__utils/constants";
export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    res.render(config.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang),
        title: "What is the business name?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang),
                title: "What is the business name?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME,
                ...pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName
            });
        } else {
            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
