import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS_UPDATE_ELEMENT, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";
import { UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import { getBusinessName } from "../../../services/common";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const payload = {
            whatIsTheBusinessName: getBusinessName(acspUpdatedFullProfile.name)
        };
        res.render(config.WHAT_IS_THE_BUSINESS_NAME, {
            typeOfBusiness: acspUpdatedFullProfile.type,
            companiesHouseRegisterLink: "https://find-and-update.company-information.service.gov.uk/",
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            payload,
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME
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
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
                payload: req.body,
                typeOfBusiness: acspUpdatedFullProfile.type,
                ...getLocaleInfo(locales, lang),
                currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME,
                ...pageProperties
            });
        } else {
            session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, req.body.whatIsTheBusinessName);
            session.setExtraData(ACSP_DETAILS_UPDATE_ELEMENT, UPDATE_WHAT_IS_THE_BUSINESS_NAME);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang));
        }
    } catch (err) {
        next(err);
    }
};
