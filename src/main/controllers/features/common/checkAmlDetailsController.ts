import { NextFunction, Request, Response } from "express";
import { BASE_URL, AML_MEMBERSHIP_NUMBER, AML_BODY_DETAILS_CONFIRM, CHECK_YOUR_ANSWERS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { USER_DATA } from "../../../common/__utils/constants";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { validationResult } from "express-validator";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;

    console.log("acspData in get:", acspData);
    console.log("aml supervisory bodies in get:", acspData?.amlSupervisoryBodies);
    res.render(config.CHECK_AML_DETAILS, {
        title: "Check the AML details",
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
        currentUrl: BASE_URL + AML_BODY_DETAILS_CONFIRM,
        editField: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
        amlSupervisoryBodies: acspData?.amlSupervisoryBodies,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        businessName: acspData?.businessName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const nextPageUrl = addLangToUrl(BASE_URL + CHECK_YOUR_ANSWERS, lang);
    res.redirect(nextPageUrl);
};
