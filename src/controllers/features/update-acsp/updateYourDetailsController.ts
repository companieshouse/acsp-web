import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import {
    AML_MEMBERSHIP_NUMBER,
    UPDATE_YOUR_ANSWERS,
    UPDATE_ACSP_DETAILS_BASE_URL,
    CANCEL_AN_UPDATE,
    UPDATE_ADD_AML_SUPERVISOR,
    REMOVE_AML_SUPERVISOR,
    UPDATE_CANCEL_ALL_UPDATES,
    UPDATE_CHECK_YOUR_UPDATES,
    AUTHORISED_AGENT,
    UPDATE_DATE_OF_THE_CHANGE,
    UPDATE_WHAT_IS_THE_COMPANY_NAME,
    UPDATE_BUSINESS_ADDRESS_LOOKUP,
    UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
    UPDATE_WHAT_IS_YOUR_EMAIL,
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_WHERE_DO_YOU_LIVE,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME
}
    from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getProfileDetails } from "../../../services/update-acsp/updateYourDetailsService";
import {
    ACSP_DETAILS,
    ACSP_UPDATE_PREVIOUS_PAGE_URL,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_DETAILS_UPDATED,
    ACSP_UPDATE_CHANGE_DATE,
    ADD_AML_BODY_UPDATE,
    AML_REMOVED_BODY_DETAILS,
    NEW_AML_BODY,
    AML_REMOVAL_INDEX,
    AML_REMOVAL_BODY
}
    from "../../../common/__utils/constants";
import { AMLSupervioryBodiesFormatted } from "../../../model/AMLSupervisoryBodiesFormatted";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { deepEquals, formatDateIntoReadableString } from "../../../services/common";
import { AcspFullProfile } from "../../../model/AcspFullProfile";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const updateFlag = !deepEquals(acspFullProfile, acspUpdatedFullProfile);

        const changeDates = {
            name: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME) || "")),
            whereDoYouLive: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE) || "")),
            nameOfBusiness: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS) || "")),
            regOfficeAddress: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS) || "")),
            correspondenceAddress: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS) || ""))
        };

        const removedAMLDetails: AmlSupervisoryBody[] = session.getExtraData(AML_REMOVED_BODY_DETAILS) ?? [];
        // Format dateOfChange in removedAMLDetails
        const formattedRemovedAMLDetails = removedAMLDetails.map(amlDetail => ({
            ...amlDetail,
            dateOfChange: amlDetail.dateOfChange ? formatDateIntoReadableString(new Date(amlDetail.dateOfChange)) : undefined
        }));

        // Delete the session from updating details
        session.deleteExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        session.deleteExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL);
        session.deleteExtraData(ADD_AML_BODY_UPDATE);
        session.deleteExtraData(NEW_AML_BODY);
        session.deleteExtraData(AML_REMOVAL_INDEX);
        session.deleteExtraData(AML_REMOVAL_BODY);

        // Before passing to view, convert dateOfChange to Date object from ISO string (to allow pre-1960 dates)
        acspUpdatedFullProfile.amlDetails = acspUpdatedFullProfile.amlDetails.map(amlDetail => ({
            ...amlDetail,
            dateOfChange: amlDetail.dateOfChange ? formatDateIntoReadableString(new Date(amlDetail.dateOfChange)) : undefined
        }));

        session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, UPDATE_YOUR_ANSWERS);

        res.render(config.UPDATE_YOUR_ANSWERS, {
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL, lang),
            editAML: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            addAML: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
            profileDetails: getProfileDetails(acspFullProfile),
            profileDetailsUpdated: getProfileDetails(acspUpdatedFullProfile),
            updateFlag,
            acspFullProfile,
            acspUpdatedFullProfile,
            cancelChangeUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE, lang),
            removeAMLUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + REMOVE_AML_SUPERVISOR, lang),
            dateOfChangeUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang),
            AMLSupervisoryBodies,
            AMLSupervioryBodiesFormatted,
            changeDates,
            formattedRemovedAMLDetails,
            cancelAllUpdatesUrl: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES, lang),
            authorisedAgentUrl: AUTHORISED_AGENT,
            UPDATE_WHAT_IS_THE_COMPANY_NAME,
            UPDATE_BUSINESS_ADDRESS_LOOKUP,
            UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
            UPDATE_WHAT_IS_YOUR_EMAIL,
            UPDATE_ACSP_WHAT_IS_YOUR_NAME,
            UPDATE_WHERE_DO_YOU_LIVE,
            UPDATE_WHAT_IS_THE_BUSINESS_NAME
        });
    } catch (err) {
        next(err);
    }
};
export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, lang));
    } catch (err) {
        next(err);
    }
};
