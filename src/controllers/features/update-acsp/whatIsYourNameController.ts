import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_ACSP_CHANGE_DETAILS, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { Session } from "@companieshouse/node-session-handler";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : {};
    const payload = {
        "first-name": acspData.applicantDetails?.firstName,
        "middle-names": acspData.applicantDetails?.middleName,
        "last-name": acspData.applicantDetails?.lastName
    };
    const reqType = "updateAcsp";
    res.render(config.WHAT_IS_YOUR_NAME, {
        ...getLocaleInfo(locales, lang),
        currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME,
        payload,
        previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_CHANGE_DETAILS, lang),
        reqType
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const errorList = validationResult(req);
    const reqType = "updateAcsp";
    const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_CHANGE_DETAILS, lang);
    if (!errorList.isEmpty()) {
        const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
        res.status(400).render(config.WHAT_IS_YOUR_NAME, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME,
            payload: req.body,
            ...pageProperties,
            reqType
        });
    } else {
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : {};

        const applicantDetails = acspData?.applicantDetails || {};
        if (acspData) {
            applicantDetails.firstName = req.body["first-name"];
            applicantDetails.middleName = req.body["middle-names"];
            applicantDetails.lastName = req.body["last-name"];
        }
        acspData.applicantDetails = applicantDetails;

        saveDataInSession(req, USER_DATA, acspData);
        res.redirect(previousPage);
    }
};
