import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, LIMITED_IS_THIS_YOUR_COMPANY, STOP_NOT_RELEVANT_OFFICER, LIMITED_WHAT_IS_YOUR_ROLE, LIMITED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS, USER_DATA } from "../../../common/__utils/constants";
import { Company } from "../../../model/Company";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {

    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    const session: Session = req.session!;
    const acspData: ACSPData = session.getExtraData(USER_DATA)!;
    const company: Company = session.getExtraData(COMPANY_DETAILS)!;

    res.render(config.WHAT_IS_YOUR_ROLE, {
        title: "What is your role in the business?",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
        currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE,
        acspType: acspData?.typeofBusiness,
        company
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);

        const session: Session = req.session!;
        const acspData: ACSPData = session.getExtraData(USER_DATA)!;
        const company: Company = session.getExtraData(COMPANY_DETAILS)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            return res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                title: "What is your role in the business?",
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY, lang),
                currentUrl: BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE,
                acspType: acspData?.typeofBusiness,
                company,
                payload: req.body,
                ...pageProperties
            });
        }
        const redirectUrlAccordingToRole = req.body.WhatIsYourRole === "SOMEONE_ELSE"
            ? STOP_NOT_RELEVANT_OFFICER
            : LIMITED_NAME_REGISTERED_WITH_AML;

        res.redirect(addLangToUrl(BASE_URL + redirectUrlAccordingToRole, lang));
    } catch (error) {
        next(error);
    }
};
