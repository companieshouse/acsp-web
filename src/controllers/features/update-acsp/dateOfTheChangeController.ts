import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_WHERE_DO_YOU_LIVE, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_WHAT_IS_YOUR_EMAIL, UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_CHECK_YOUR_UPDATES } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";
import { getPreviousPageUrl } from "../../../services/url";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const prevUrl = getPreviousPageUrl(req, UPDATE_ACSP_DETAILS_BASE_URL);
    const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + determinePreviousPageUrl(prevUrl), lang);
    const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;

    try {
        res.render(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;
        const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_DATE_OF_THE_CHANGE, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            const dateOfChange = new Date(
                req.body["change-year"],
                req.body["change-month"] - 1,
                req.body["change-day"]);
            const session: Session = req.session as any as Session;

            if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS) === null) {
                session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS, dateOfChange);
            } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME) === null) {
                session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
            } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE) === null) {
                session.setExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE, dateOfChange);
            } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS) === null) {
                session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS, dateOfChange);
            } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS) === null) {
                session.setExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS, dateOfChange);
            } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.EMAIL) === null) {
                session.setExtraData(ACSP_UPDATE_CHANGE_DATE.EMAIL, dateOfChange);
            }

            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
        }
    } catch (err) {
        next(err);
    }
};
export const determinePreviousPageUrl = (url: string): string => {
    let previousPageUrl = UPDATE_YOUR_ANSWERS;
    if (url?.includes(UPDATE_ACSP_WHAT_IS_YOUR_NAME)) {
        previousPageUrl = UPDATE_ACSP_WHAT_IS_YOUR_NAME;
    } else if (url?.includes(UPDATE_WHERE_DO_YOU_LIVE)) {
        previousPageUrl = UPDATE_WHERE_DO_YOU_LIVE;
    } else if (url?.includes(UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM)) {
        previousPageUrl = UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP;
    } else if (url?.includes(UPDATE_WHAT_IS_YOUR_EMAIL)) {
        previousPageUrl = UPDATE_WHAT_IS_YOUR_EMAIL;
    } else if (url?.includes(UPDATE_WHAT_IS_THE_BUSINESS_NAME)) {
        previousPageUrl = UPDATE_WHAT_IS_THE_BUSINESS_NAME;
    }
    return previousPageUrl;
};
