import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, REQ_TYPE_UPDATE_ACSP } from "../../../common/__utils/constants";
import { UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
    const payload = {
        whatIsTheBusinessName: acspData.name
    };
    const reqType = REQ_TYPE_UPDATE_ACSP;

    res.render(config.WHAT_IS_THE_BUSINESS_NAME, {
        previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
        ...getLocaleInfo(locales, lang),
        payload,
        currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME,
        reqType
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const errorList = validationResult(req);
    const session: Session = req.session as any as Session;
    const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
    var acspDataUpdated: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const reqType = REQ_TYPE_UPDATE_ACSP;
    if (!errorList.isEmpty()) {
        const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
        res.status(400).render(config.WHAT_IS_THE_BUSINESS_NAME, {
            previousPage,
            payload: req.body,
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME,
            reqType,
            ...pageProperties
        });
    } else {
        if (acspDataUpdated) {
            acspDataUpdated.name = req.body.whatIsTheBusinessName;
        }
        saveDataInSession(req, ACSP_DETAILS_UPDATED, acspDataUpdated);
        const nextPageUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang);
        res.redirect(nextPageUrl);
    }
};
