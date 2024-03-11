import { Request, Response, NextFunction } from "express";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, SOLE_TRADER_NAME_REGISTERED_WITH_AML, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { validationResult } from "express-validator";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SOLE_TRADER_WHAT_IS_YOUR_ROLE, {
        title: "What is your role?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedRole = req.body.WhatIsYourRole;
        console.log(typeof selectedRole);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_ROLE, {
                title: "What is your role?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE,
                ...pageProperties
            });
        } else {

            switch (selectedRole) {
            case "DIRECTOR":
            case "GENERAL_PARTNER":
            case "MEMBER_OF_THE_PARTNERSHIP":
            case "SOLE_TRADER":
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_NAME_REGISTERED_WITH_AML, lang));
                break;
            case "SOMEONE_ELSE":
                res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
                break;

            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});