import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_WHAT_IS_YOUR_EMAIL, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_CHECK_YOUR_UPDATES } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, AML_REMOVAL_BODY, AML_REMOVAL_INDEX } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

        let payload = {};
        if (acspUpdatedFullProfile.email === acspFullProfile.email) {
            payload = {
                whatIsYourEmailRadio: acspUpdatedFullProfile.email
            };
        } else {
            payload = {
                whatIsYourEmailRadio: "A Different Email",
                whatIsYourEmailInput: acspUpdatedFullProfile.email
            };
        }

        // Delete the temporary AML removal index and body from the session
        // Prevents the removed AML details from clearing on Your Updates view
        session.deleteExtraData(AML_REMOVAL_INDEX);
        session.deleteExtraData(AML_REMOVAL_BODY);

        res.render(config.UPDATE_WHAT_IS_YOUR_EMAIL, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL,
            correspondenceEmail: acspFullProfile.email,
            payload
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_WHAT_IS_YOUR_EMAIL, {
                ...pageProperties,
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
                currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL,
                correspondenceEmail: acspFullProfile.email,
                payload: req.body
            });
        } else {
            acspUpdatedFullProfile.email = req.body.whatIsYourEmailInput;
            session.setExtraData(ACSP_DETAILS_UPDATED, acspUpdatedFullProfile);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
        }
    } catch (err) {
        next(err);
    }
};
