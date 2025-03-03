import { Request, Response, NextFunction } from "express";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import * as config from "../../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_APPLICATION_CONFIRMATION, UPDATE_CANCEL_ALL_UPDATES, UPDATE_CHECK_YOUR_UPDATES, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import { AcspUpdateService } from "../../../services/update-acsp/acspUpdateService";
import { Session } from "@companieshouse/node-session-handler";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { getFormattedAddedAMLUpdates, getFormattedRemovedAMLUpdates, getFormattedUpdates } from "../../../services/update-acsp/yourUpdatesService";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";

const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES;
const locales = getLocalesService();

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        res.render(config.UPDATE_CHECK_YOUR_UPDATES, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            lang,
            cancelAllUpdatesUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES, lang),
            yourDetails: getFormattedUpdates(session, acspFullProfile, acspUpdatedFullProfile),
            addAML: getFormattedAddedAMLUpdates(acspFullProfile, acspUpdatedFullProfile),
            removeAML: getFormattedRemovedAMLUpdates(acspFullProfile, acspUpdatedFullProfile)
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_CHECK_YOUR_UPDATES, {
                ...getLocaleInfo(locales, lang),
                ...pageProperties,
                currentUrl,
                previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
                lang,
                cancelAllUpdatesUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES, lang),
                yourDetails: getFormattedUpdates(session, acspFullProfile, acspUpdatedFullProfile)
            });
        } else {

            if (req.body.moreUpdates === "no") {
                const acspUpdateService = new AcspUpdateService();
                await acspUpdateService.createTransaction(session);
                res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION, lang));
            } else {
                res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang));
            }
        }
    } catch (err) {
        next(err);
    }
};
