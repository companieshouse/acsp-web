import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { getBusinessName, isLimitedBusinessType } from "../../../services/common";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_UPDATE_PREVIOUS_PAGE_URL, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED, AML_REMOVAL_BODY, AML_REMOVAL_INDEX } from "../../../common/__utils/constants";
import { UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE, UPDATE_WHAT_IS_THE_COMPANY_NAME } from "../../../types/pageURL";
import { CHS_URL } from "../../../utils/properties";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const updateInProgress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        const isLimitedBusiness = isLimitedBusinessType(acspUpdatedFullProfile.type);
        const currentUrl: string = isLimitedBusiness
            ? UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME
            : UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME;

        const payload = {
            whatIsTheBusinessName: updateInProgress || getBusinessName(acspUpdatedFullProfile.name)
        };

        // Delete the temporary AML removal index and body from the session
        // Prevents the removed AML details from clearing on Your Updates view
        session.deleteExtraData(AML_REMOVAL_INDEX);
        session.deleteExtraData(AML_REMOVAL_BODY);

        res.render(config.WHAT_IS_THE_BUSINESS_NAME, {
            typeOfBusiness: acspUpdatedFullProfile.type,
            isLimitedBusiness,
            companiesHouseRegisterLink: CHS_URL,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            payload,
            currentUrl
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
        const isLimitedBusiness = isLimitedBusinessType(acspUpdatedFullProfile.type);
        const currentUrl: string = isLimitedBusiness
            ? UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME
            : UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_THE_BUSINESS_NAME, {
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
                payload: req.body,
                isLimitedBusiness,
                typeOfBusiness: acspUpdatedFullProfile.type,
                ...getLocaleInfo(locales, lang),
                companiesHouseRegisterLink: CHS_URL,
                currentUrl,
                ...pageProperties
            });
        } else {
            session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, req.body.whatIsTheBusinessName);
            session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, UPDATE_WHAT_IS_THE_BUSINESS_NAME);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang));
        }
    } catch (err) {
        next(err);
    }
};
