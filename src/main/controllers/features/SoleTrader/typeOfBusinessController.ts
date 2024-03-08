import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_TYPE_OF_BUSINESS, START, SOLE_TRADER_OTHER_TYPE_OFBUSINESS, SOLE_TRADER_ROLE, BASE_URL } from "../../../types/pageURL";
import { TypeOfBusinessService } from "../../..//services/typeOfBusinessService";
import { SUBMISSION_ID, TRANSACTION_CREATE_ERROR } from "../../../common/__utils/constants";
import logger from "../../../../../lib/Logger";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const typeOfBusinessService = new TypeOfBusinessService();
    // create transaction record
    try {
        await typeOfBusinessService.createTransaction(req, res, "").then((transactionId) => {
            // get transaction record data
            saveDataInSession(req, SUBMISSION_ID, transactionId);
        });
    } catch (err) {
        logger.error(TRANSACTION_CREATE_ERROR);
        return Promise.reject(err);
    }
    res.render(config.SOLE_TRADER_TYPE_OF_BUSINESS, {
        previousPage: addLangToUrl(START, lang),
        title: "What type of business are you registering?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS,
        typeOfBusiness: req.query.typeOfBusiness
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(START, lang),
                title: "What type of business are you registering?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_TYPE_OF_BUSINESS,
                ...pageProperties
            });
        } else {
            var nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_ROLE, lang);
            if (req.body.typeOfBusinessRadio === "OTHER") {
                nextPageUrl = addLangToUrl(BASE_URL + SOLE_TRADER_OTHER_TYPE_OFBUSINESS, lang);
            }
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
