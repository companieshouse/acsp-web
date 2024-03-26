import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_NAME_REGISTERED_WITH_AML, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_NAME, BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { UNINCORPORATED_AML_SELECTED_OPTION } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.NAME_REGISTERED_WITH_AML, {
        previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
        title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.nameRegisteredWithAml;
        const session: Session = req.session as any as Session;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.NAME_REGISTERED_WITH_AML, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML,
                ...pageProperties
            });
        } else {
            if (session) {
                session.setExtraData(UNINCORPORATED_AML_SELECTED_OPTION, selectedOption);
            }
            // Redirection logic based on selected option
            if (selectedOption === "NAME_OF_THE_BUSINESS") {
                // User is only supervised under their business name, so redirect back to the AML supervisor name page
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang));
            } else {
                // User is supervised under their personal name or both personal and business name, so redirect to the "What is your name?" page
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
