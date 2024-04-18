import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, SOLE_TRADER_DATE_OF_BIRTH, SOLE_TRADER_WHAT_IS_YOUR_ROLE, SOLE_TRADER_WHAT_IS_YOUR_NAME } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.WHAT_IS_YOUR_NAME, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang),
        title: "What is your name?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_NAME, {
                title: "What is your name?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang),
                currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME,
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            const session: Session = req.session as any as Session;
            const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
            if (acspData) {
                acspData.firstName = req.body["first-name"];
                acspData.lastName = req.body["last-name"];
            }

            if (session) {
                session.setExtraData(USER_DATA, acspData);
            }
            const nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};
