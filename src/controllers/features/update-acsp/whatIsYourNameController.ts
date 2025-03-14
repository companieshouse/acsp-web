import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, REQ_TYPE_UPDATE_ACSP } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const payload = {
            "first-name": acspData.soleTraderDetails?.forename,
            "middle-names": acspData.soleTraderDetails?.otherForenames,
            "last-name": acspData.soleTraderDetails?.surname
        };
        const reqType = REQ_TYPE_UPDATE_ACSP;
        res.render(config.WHAT_IS_YOUR_NAME, {
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME,
            payload,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            reqType
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const reqType = REQ_TYPE_UPDATE_ACSP;
        const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
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
            var acspDataUpdated: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;

            const soleTraderDetails = acspDataUpdated.soleTraderDetails || {};
            if (acspDataUpdated) {
                soleTraderDetails.forename = req.body["first-name"];
                soleTraderDetails.otherForenames = req.body["middle-names"];
                soleTraderDetails.surname = req.body["last-name"];
            }
            acspDataUpdated.soleTraderDetails = soleTraderDetails!;
            saveDataInSession(req, ACSP_DETAILS_UPDATED, acspDataUpdated);
            res.redirect(previousPage);
        }
    } catch (err) {
        next(err);
    }
};
