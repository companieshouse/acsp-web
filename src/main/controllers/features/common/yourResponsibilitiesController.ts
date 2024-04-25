import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { AML_BODY_DETAILS_CONFIRM, YOUR_RESPONSIBILITIES, BASE_URL, CHECK_YOUR_ANSWERS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.YOUR_RESPONSIBILITIES, {
        previousPage: addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang),
        title: "Your responsibilities as an authorised agent",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + YOUR_RESPONSIBILITIES,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        businessName: acspData?.businessName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.YOUR_RESPONSIBILITIES, {
                previousPage: addLangToUrl(BASE_URL + AML_BODY_DETAILS_CONFIRM, lang),
                title: "Your responsibilities as an authorised agent",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + YOUR_RESPONSIBILITIES,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                businessName: acspData?.businessName,
                ...pageProperties
            });
        } else {
            res.redirect(addLangToUrl(BASE_URL + CHECK_YOUR_ANSWERS, lang));
        }
    } catch (error) {
        next(error);
    }
};
