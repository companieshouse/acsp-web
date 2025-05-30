import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";
import { UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CANCEL_ALL_UPDATES, AUTHORISED_AGENT } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const updateDetailsGoBackLink = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);

        res.render(config.UPDATE_CANCEL_ALL_UPDATES, {
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES,
            updateDetailsGoBackLink
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

        session.setExtraData(ACSP_DETAILS_UPDATED, acspFullProfile);
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.NAME);
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS);
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE);
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS);
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS);
        session.deleteExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);

        res.redirect(AUTHORISED_AGENT);
    } catch (err) {
        next(err);
    }
};
