import { NextFunction, Request, Response } from "express";
import { selectLang, getLocalesService, getLocaleInfo, addLangToUrl } from "../../../utils/localise";
import * as config from "../../../config";
import { AML_MEMBERSHIP_NUMBER, BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_ACSP_WHAT_IS_YOUR_NAME, ACSP_DETAILS_UPDATE_CONFIRMATION } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, ACSP_DETAILS } from "../../../common/__utils/constants";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getProfileDetails } from "../../../services/update-acsp/updateYourDetailsService";
import { AMLSupervisoryBodies } from "../../../model/AMLSupervisoryBodies";
import { getPreviousPageUrl } from "../../../services/url";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSPFullProfileDetails } from "model/ACSPFullProfileDetails";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UPDATE_YOUR_ANSWERS;
    const prevUrl = getPreviousPageUrl(req, UPDATE_ACSP_DETAILS_BASE_URL);
    const updateNameVisited: boolean = prevUrl?.includes(UPDATE_ACSP_WHAT_IS_YOUR_NAME);
    try {
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const detailsAnswers: ACSPFullProfileDetails = getProfileDetails(req, acspFullProfile, locales.i18nCh.resolveNamespacesKeys(lang));

        res.render(config.UPDATE_YOUR_ANSWERS, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            updateNameVisited,
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL, lang),
            editAML: addLangToUrl(BASE_URL + AML_MEMBERSHIP_NUMBER, lang),
            detailsAnswers,
            acspFullProfile,
            lang,
            AMLSupervisoryBodies
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + ACSP_DETAILS_UPDATE_CONFIRMATION, lang));
};
