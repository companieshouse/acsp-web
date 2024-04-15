import { NextFunction, Request, Response } from "express";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, SOLE_TRADER_WHAT_IS_YOUR_ROLE, AML_BODY_DETAILS_CONFIRM, AML_MEMBERSHIP_NUMBER } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "node-mocks-http";
import { ACSPData } from "../../../model/ACSPData";
import { USER_DATA } from "../../../common/__utils/constants";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { validationResult } from "express-validator";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.AML_MEMBERSHIP_NUMBER, {
        title: "What is the Anti-Money Laundering (AML) membership number?",
        ...getLocaleInfo(locales, lang),
        // previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang),
        currentUrl: BASE_URL + AML_MEMBERSHIP_NUMBER,
        selectedAMLSupervisoryBodies : acspData?.selectedAML 
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
            res.status(400).render(config.AML_MEMBERSHIP_NUMBER, {
                // previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang),
                title: "What is the Anti-Money Laundering (AML) membership number?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + AML_MEMBERSHIP_NUMBER,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                selectedAMLSupervisoryBodies : acspData?.selectedAML 
            });
        } else {
            const nextPageUrl = addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang);
            res.redirect(nextPageUrl);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
