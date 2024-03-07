import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../../../../../lib/nationalityList";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { SOLE_TRADER_DATE_OF_BIRTH, BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { UserData } from "../../../model/UserData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const userData : UserData = session?.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
        title: "What is your nationality?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang),
        currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY,
        nationalityList: nationalityList,
        firstName: userData?.firstName,
        lastName: userData?.lastName

    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session?.getExtraData(USER_DATA)!;

    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang),
                title: "What is your nationality?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY,
                nationalityList: nationalityList,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: userData?.firstName,
                lastName: userData?.lastName

            });// determined from user not in banned list
        } else {
            // If validation passes, redirect to the next page
            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang);
            res.redirect(nextPageUrl);
            // if banned user redirect kickoutpage- under construction
            /* res.redirect("/sole-trader/stop-screen-not-a-soletrader"); */
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
