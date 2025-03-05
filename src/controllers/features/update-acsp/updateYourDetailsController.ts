import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { AML_MEMBERSHIP_NUMBER, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, CANCEL_AN_UPDATE, UPDATE_ADD_AML_SUPERVISOR, REMOVE_AML_SUPERVISOR, UPDATE_CANCEL_ALL_UPDATES, UPDATE_CHECK_YOUR_UPDATES } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getProfileDetails, validateUpdatesWithoutDate } from "../../../services/update-acsp/updateYourDetailsService";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ADD_AML_BODY_UPDATE, NEW_AML_BODY } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSPFullProfileDetails } from "../../../model/ACSPFullProfileDetails";
import { AMLSupervioryBodiesFormatted } from "../../../model/AMLSupervisoryBodiesFormatted";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        validateUpdatesWithoutDate(req, acspFullProfile, acspUpdatedFullProfile);
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
            cancelAllUpdatesUrl
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
