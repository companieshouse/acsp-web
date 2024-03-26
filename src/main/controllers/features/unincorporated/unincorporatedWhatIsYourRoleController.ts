import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ACSP_TYPE, BUSINESS_NAME, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { ACSPData } from "../../../model/ACSPData";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHICH_SECTOR } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspType = session?.getExtraData(ACSP_TYPE)!;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.WHAT_IS_YOUR_ROLE, {
        title: "What is your role in the business?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE,
        acspType: acspType,
        unincorporatedBusinessName: acspData?.businessName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const acspType = session?.getExtraData(ACSP_TYPE)!;
        const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                title: "What is your role in the business?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE,
                pageProperties: pageProperties,
                payload: req.body,
                acspType: acspType,
                unincorporatedBusinessName: acspData?.businessName
            });
        } else {
            const redirectUrlAccordingToRole = redirectUrl(req.body.WhatIsYourRole, lang);
            res.redirect(addLangToUrl(redirectUrlAccordingToRole, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});

const redirectUrl = (role: string, lang: string): string => {
    return role === "SOMEONE_ELSE" ? BASE_URL + STOP_NOT_RELEVANT_OFFICER : BASE_URL + UNINCORPORATED_WHICH_SECTOR;
};
