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
    AUTHORISED_AGENT
}
    from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getProfileDetails } from "../../../services/update-acsp/updateYourDetailsService";
import {
    ACSP_DETAILS,
    ACSP_DETAILS_UPDATE_ELEMENT,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_DETAILS_UPDATED,
    ACSP_UPDATE_CHANGE_DATE,
    ADD_AML_BODY_UPDATE,
    NEW_AML_BODY
}
    from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSPFullProfileDetails } from "../../../model/ACSPFullProfileDetails";
import { AMLSupervioryBodiesFormatted } from "../../../model/AMLSupervisoryBodiesFormatted";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { formatDateIntoReadableString } from "../../../services/common";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        session.deleteExtraData(ACSP_DETAILS_UPDATE_ELEMENT);
        session.deleteExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        const changeDates = {
            name: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME) || "")),
            whereDoYouLive: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE) || "")),
            nameOfBusiness: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS) || "")),
            regOfficeAddress: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS) || "")),
            correspondenceAddress: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS) || ""))
        };

        const profileDetails: ACSPFullProfileDetails = getProfileDetails(acspFullProfile);
        const profileDetailsUpdated: ACSPFullProfileDetails = getProfileDetails(acspUpdatedFullProfile);
        var updateFlag = JSON.stringify(acspFullProfile) !== JSON.stringify(acspUpdatedFullProfile);
        session.deleteExtraData(ADD_AML_BODY_UPDATE);
        session.deleteExtraData(NEW_AML_BODY);

        const cancelChangeUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE, lang);
        const removeAMLUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + REMOVE_AML_SUPERVISOR, lang);
        const cancelAllUpdatesUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES, lang);

        res.render(config.UPDATE_YOUR_ANSWERS, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL, lang),
            editAML: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            addAML: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
            profileDetails,
            profileDetailsUpdated,
            updateFlag,
            acspFullProfile,
            acspUpdatedFullProfile,
            lang,
            cancelChangeUrl,
            removeAMLUrl,
            AMLSupervisoryBodies,
            AMLSupervioryBodiesFormatted,
            changeDates,
            cancelAllUpdatesUrl,
            authorisedAgentUrl: AUTHORISED_AGENT
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
