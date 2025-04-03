import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { getPreviousPageUrl } from "../../../services/url";
import { updateWithTheEffectiveDateAmendment } from "../../../services/update-acsp/dateOfTheChangeService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const cancelTheUpdateUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const prevUrl = getPreviousPageUrl(req, UPDATE_ACSP_DETAILS_BASE_URL) || UPDATE_ACSP_DETAILS_BASE_URL;
        const previousPage: string = addLangToUrl(prevUrl, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;
        res.render(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            cancelTheUpdateUrl,
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
        const cancelTheUpdateUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;
        const prevUrl = getPreviousPageUrl(req, UPDATE_ACSP_DETAILS_BASE_URL) || UPDATE_ACSP_DETAILS_BASE_URL;
        const previousPage: string = addLangToUrl(prevUrl, lang);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_DATE_OF_THE_CHANGE, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                cancelTheUpdateUrl,
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            const dateOfChange = new Date(
                req.body["change-year"],
                req.body["change-month"] - 1,
                req.body["change-day"]);
            updateWithTheEffectiveDateAmendment(req, dateOfChange.toISOString());
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
        }
    } catch (err) {
        next(err);
    }
};
