import { Request, Response, NextFunction } from "express";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import * as config from "../../../config";
import { CANCEL_AN_UPDATE, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_ADD_AML_SUPERVISOR, UPDATE_APPLICATION_CONFIRMATION, UPDATE_CANCEL_ALL_UPDATES, UPDATE_CHECK_YOUR_UPDATES, UPDATE_DATE_OF_THE_CHANGE, UPDATE_PROVIDE_AML_DETAILS, UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_WHAT_IS_THE_COMPANY_NAME, UPDATE_YOUR_ANSWERS, REMOVE_AML_SUPERVISOR, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_WHERE_DO_YOU_LIVE, UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_WHAT_IS_YOUR_EMAIL, UPDATE_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { AcspUpdateService } from "../../../services/update-acsp/acspUpdateService";
import { Session } from "@companieshouse/node-session-handler";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { getFormattedAddedAMLUpdates, getFormattedRemovedAMLUpdates, getFormattedUpdates } from "../../../services/update-acsp/yourUpdatesService";
import { ACSP_DETAILS, ACSP_UPDATE_PREVIOUS_PAGE_URL, ACSP_DETAILS_UPDATED, UPDATE_DESCRIPTION, UPDATE_REFERENCE, UPDATE_SUBMISSION_ID, CEASED } from "../../../common/__utils/constants";
import { closeTransaction } from "../../../services/transactions/transaction_service";
import { AcspFullProfile } from "../../../model/AcspFullProfile";
import { getPreviousPageUrl } from "../../../services/url";
import { isLimitedBusinessType } from "../../../services/common";
import { getLoggedInAcspNumber } from "../../../common/__utils/session";
import { getAcspFullProfile } from "../../../services/acspProfileService";
import { AcspCeasedError } from "../../../errors/acspCeasedError";
import { SupervisoryBodyMapping } from "../../../model/SupervisoryBodyMapping";

const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES;
const locales = getLocalesService();

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const yourDetails = getFormattedUpdates(session, acspFullProfile, acspUpdatedFullProfile);
        const previousPage = getPreviousPageWithLang(req, UPDATE_ACSP_DETAILS_BASE_URL);
        const addedAMLBodies = getFormattedAddedAMLUpdates(acspFullProfile, acspUpdatedFullProfile);
        const removedAMLBodies = getFormattedRemovedAMLUpdates(session, acspFullProfile, acspUpdatedFullProfile);
        const isLimitedBusiness = isLimitedBusinessType(acspUpdatedFullProfile.type);

        let redirectQuery = "your-updates";
        if (Object.keys(yourDetails).length + addedAMLBodies.length + removedAMLBodies.length === 1) {
            redirectQuery = "your-answers";
        }
        res.render(config.UPDATE_CHECK_YOUR_UPDATES, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            SupervisoryBodyMapping,
            yourDetails,
            addedAMLBodies,
            removedAMLBodies,
            redirectQuery,
            isLimitedBusiness,
            UPDATE_ACSP_WHAT_IS_YOUR_NAME,
            UPDATE_WHERE_DO_YOU_LIVE,
            UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
            UPDATE_WHAT_IS_YOUR_EMAIL,
            UPDATE_BUSINESS_ADDRESS_LOOKUP,
            type: acspFullProfile.type,
            editBusinessNameUrl: getBusinessNameUrl(acspFullProfile.type, lang),
            previousPage: addLangToUrl(previousPage + (previousPage.includes("?") ? "&" : "?") + "return=your-updates", lang),
            cancelAllUpdatesUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES, lang),
            addAMLUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
            removeAMLUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + REMOVE_AML_SUPERVISOR, lang),
            cancelChangeUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE, lang)
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
        const yourDetails = getFormattedUpdates(session, acspFullProfile, acspUpdatedFullProfile);
        const previousPage = getPreviousPageWithLang(req, UPDATE_ACSP_DETAILS_BASE_URL);
        const addedAMLBodies = getFormattedAddedAMLUpdates(acspFullProfile, acspUpdatedFullProfile);
        const removedAMLBodies = getFormattedRemovedAMLUpdates(session, acspFullProfile, acspUpdatedFullProfile);

        let redirectQuery = "your-updates";
        if (Object.keys(yourDetails).length + addedAMLBodies.length + removedAMLBodies.length === 1) {
            redirectQuery = "your-answers";
        }

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.UPDATE_CHECK_YOUR_UPDATES, {
                ...getLocaleInfo(locales, lang),
                ...pageProperties,
                currentUrl,
                SupervisoryBodyMapping,
                yourDetails,
                addedAMLBodies,
                removedAMLBodies,
                redirectQuery,
                UPDATE_ACSP_WHAT_IS_YOUR_NAME,
                UPDATE_WHERE_DO_YOU_LIVE,
                UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
                UPDATE_WHAT_IS_YOUR_EMAIL,
                UPDATE_BUSINESS_ADDRESS_LOOKUP,
                type: acspFullProfile.type,
                editBusinessNameUrl: getBusinessNameUrl(acspFullProfile.type, lang),
                previousPage: addLangToUrl(previousPage, lang),
                cancelAllUpdatesUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES, lang),
                addAMLUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
                removeAMLUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + REMOVE_AML_SUPERVISOR, lang),
                cancelChangeUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE, lang)
            });
        } else if (req.body.moreUpdates === "no" && acspUpdatedFullProfile.amlDetails.length === 0) {
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_PROVIDE_AML_DETAILS, lang));
        } else if (req.body.moreUpdates === "no") {

            // Check the ACSP's status and if they are ceased throw an error
            const acspNumber: string = getLoggedInAcspNumber(req.session);
            const acspDetails = await getAcspFullProfile(acspNumber);
            session.setExtraData(ACSP_DETAILS, acspDetails);

            if (acspDetails.status === CEASED) {
                throw new AcspCeasedError("ACSP is ceased. Cannot proceed with updates.");
            }

            // If the user has no more updates, we save the updated details and create a transaction
            const acspUpdateService = new AcspUpdateService();
            await acspUpdateService.createTransaction(session);
            await acspUpdateService.saveUpdatedDetails(session, acspFullProfile, acspUpdatedFullProfile);
            await closeTransaction(session, session.getExtraData(UPDATE_SUBMISSION_ID)!, UPDATE_DESCRIPTION, UPDATE_REFERENCE);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION, lang));
        } else {
            session.deleteExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL);
            res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang));
        }
    } catch (err) {
        next(err);
    }
};

function getPreviousPageWithLang (req: Request, baseUrl: string): string {
    const previousPageUrl = getPreviousPageUrl(req, baseUrl);
    if (previousPageUrl?.includes(UPDATE_DATE_OF_THE_CHANGE)) {
        return baseUrl + UPDATE_DATE_OF_THE_CHANGE;
    } else if (previousPageUrl?.includes(UPDATE_WHAT_IS_YOUR_EMAIL)) {
        return baseUrl + UPDATE_WHAT_IS_YOUR_EMAIL;
    } else {
        return baseUrl + UPDATE_YOUR_ANSWERS;
    }
}

const getBusinessNameUrl = (type: string, lang: string): string => {
    return isLimitedBusinessType(type)
        ? addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_COMPANY_NAME, lang)
        : addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME, lang);
};
