import { Request, Response, NextFunction } from "express";
import * as config from "../../../config";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, CLOSE_WHAT_WILL_HAPPEN } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { ACSP_DETAILS } from "../../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

        res.render(config.CLOSE_WHAT_WILL_HAPPEN, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(CLOSE_ACSP_BASE_URL, lang),
            currentUrl: CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN,
            businessName: acspDetails.name
        });
    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.CLOSE_WHAT_WILL_HAPPEN, {
                ...pageProperties,
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(CLOSE_ACSP_BASE_URL, lang),
                currentUrl: CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN,
                businessName: acspDetails.name
            });
        } else {
            res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, lang));
        }
    } catch (err) {
        next(err);
    }
};
