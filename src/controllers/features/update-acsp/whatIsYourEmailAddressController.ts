import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { BASE_URL, UPDATE_WHAT_IS_YOUR_EMAIL, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE, UPDATE_CHECK_YOUR_UPDATES } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const currentUrl = BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL;

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
        res.render(config.UPDATE_WHAT_IS_YOUR_EMAIL, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
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
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const previousPage = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_WHAT_IS_YOUR_EMAIL, {
                previousPage,
                correspondenceEmail: acspFullProfile.email,
                payload: req.body,
                ...getLocaleInfo(locales, lang),
                currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_YOUR_EMAIL,
                ...pageProperties
            });
        } else {
            if (req.body.whatIsYourEmailRadio === "A Different Email") {
                acspUpdatedFullProfile.email = req.body.whatIsYourEmailInput;
                saveDataInSession(req, ACSP_DETAILS_UPDATED, acspUpdatedFullProfile);
                const nextPageUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang);
                res.redirect(nextPageUrl);
            }
        }
    } catch (err) {
        next(err);
    }
};
