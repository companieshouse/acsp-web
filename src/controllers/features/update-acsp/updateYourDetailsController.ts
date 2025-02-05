import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { AML_MEMBERSHIP_NUMBER, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, ACSP_DETAILS_UPDATE_CONFIRMATION, CANCEL_AN_UPADTE } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";
import { getProfileDetails } from "../../../services/update-acsp/updateYourDetailsService";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSPFullProfileDetails } from "../../../model/ACSPFullProfileDetails";
import { AcspUpdateService } from "../../../services/update-acsp/acspUpdateService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
        const profileDetails: ACSPFullProfileDetails = getProfileDetails(req, acspFullProfile, locales.i18nCh.resolveNamespacesKeys(lang));
        const profileDetailsUpdated: ACSPFullProfileDetails = getProfileDetails(req, acspUpdatedFullProfile, locales.i18nCh.resolveNamespacesKeys(lang));
        var updateFlag = JSON.stringify(profileDetails) !== JSON.stringify(profileDetailsUpdated);

        const cancelChangeUrl = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPADTE, lang);

        res.render(config.UPDATE_YOUR_ANSWERS, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL, lang),
            editAML: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            profileDetails,
            profileDetailsUpdated,
            updateFlag,
            acspFullProfile,
            lang,
            AMLSupervisoryBodies,
            cancelChangeUrl
        });
    } catch (err) {
        next(err);
    }
};
export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const acspUpdateService = new AcspUpdateService();
        await acspUpdateService.createTransaction(session);
        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + ACSP_DETAILS_UPDATE_CONFIRMATION, lang));
    } catch (err) {
        next(err);
    }
};
