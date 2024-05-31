import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SAVED_APPLICATION, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getSavedApplication, postAcspRegistration } from "../../../services/acspRegistrationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const savedApplication = await getSavedApplication(session, res.locals.userId);
    const lang = selectLang(req.query.lang);
    let nextPageUrl = "";
    if (savedApplication.status === 404) {
        nextPageUrl = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
    } else if (savedApplication.status === 204) {
        nextPageUrl = addLangToUrl(BASE_URL + SAVED_APPLICATION, lang);
    } else {
        console.log("error handling");
    }

    res.redirect(nextPageUrl);
};
