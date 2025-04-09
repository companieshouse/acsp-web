import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS_UPDATED, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATE_ELEMENT } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { soleTraderNameDetails } from "model/SoleTraderNameDetails";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const payload = {
            "first-name": acspUpdatedFullProfile.soleTraderDetails?.forename,
            "middle-names": acspUpdatedFullProfile.soleTraderDetails?.otherForenames,
            "last-name": acspUpdatedFullProfile.soleTraderDetails?.surname
        };
        res.render(config.WHAT_IS_YOUR_NAME, {
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME,
            payload,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang)
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
        const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_NAME, {
                ...getLocaleInfo(locales, lang),
                previousPage,
                currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME,
                payload: req.body,
                ...pageProperties
            });
        } else {
            const session: Session = req.session as any as Session;
            const soleTraderDetails: soleTraderNameDetails = {};
            soleTraderDetails.forename = req.body["first-name"];
            soleTraderDetails.otherForenames = req.body["middle-names"];
            soleTraderDetails.surname = req.body["last-name"];

            session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, soleTraderDetails);
            session.setExtraData(ACSP_DETAILS_UPDATE_ELEMENT, UPDATE_ACSP_WHAT_IS_YOUR_NAME);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang));
        }
    } catch (err) {
        next(err);
    }
};
