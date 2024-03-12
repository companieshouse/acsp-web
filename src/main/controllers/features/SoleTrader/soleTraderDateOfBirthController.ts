import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NAME, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_DATE_OF_BIRTH } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const ACSPData : ACSPData = session?.getExtraData(USER_DATA)!;

    res.render(config.SOLE_TRADER_DATE_OF_BIRTH, {
        title: "What is your date of Birth?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang),
        currentUrl: BASE_URL + SOLE_TRADER_DATE_OF_BIRTH,
        firstName: ACSPData?.firstName,
        lastName: ACSPData?.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const ACSPData : ACSPData = session?.getExtraData(USER_DATA)!;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_DATE_OF_BIRTH, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang),
                title: "What is your date of Birth?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_DATE_OF_BIRTH,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: ACSPData?.firstName,
                lastName: ACSPData?.lastName
            });
        } else {
            res.redirect(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
