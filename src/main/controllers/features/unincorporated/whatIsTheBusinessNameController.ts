import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, BASE_URL, TYPE_OF_BUSINESS, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHAT_IS_YOUR_NAME, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { UNINCORPORATED_AML_SELECTED_OPTION, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ACSPData } from "main/model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const unincorporatedAmlSelectedOption = session?.getExtraData(UNINCORPORATED_AML_SELECTED_OPTION)!;
    let previousPage;
    // Check if the selected option is "NAME_OF_THE_BUSINESS
    if (unincorporatedAmlSelectedOption === "NAME_OF_THE_BUSINESS") {
        previousPage = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;
    } else {
        previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;
    }
    res.render(config.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, {
        previousPage: addLangToUrl(previousPage, lang),
        title: "What is the business name?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const unincorporatedAmlSelectedOption = session?.getExtraData(UNINCORPORATED_AML_SELECTED_OPTION)!;
        let previousPage;
        // Check if the selected option is "NAME_OF_THE_BUSINESS
        if (unincorporatedAmlSelectedOption === "NAME_OF_THE_BUSINESS") {
            previousPage = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;
        } else {
            previousPage = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME;
        }
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(previousPage, lang),
                title: "What is the business name?",
                payload: req.body,
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME,
                ...pageProperties
            });
        } else {
            const unincorporatedBusinessName = req.body.whatIsTheBusinessName;
            const acspData: ACSPData = session.getExtraData(USER_DATA)!;
            if (acspData) {
                acspData.businessName = unincorporatedBusinessName;
                saveDataInSession(req, USER_DATA, acspData);
            } else {
                const acspDataBusinessName : ACSPData = {
                    businessName: unincorporatedBusinessName
                };
                if (session) {
                    session.setExtraData(USER_DATA, acspDataBusinessName);
                }
            }
            const nextPageUrl = addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
