import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS_UPDATED, ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";
import { UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CANCEL_ALL_UPDATES, MANAGE_USERS_DASHBOARD } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const updateDetailsGoBackLink = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);

    res.render(config.UPDATE_CANCEL_ALL_UPDATES, {
        previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
        ...getLocaleInfo(locales, lang),
        currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES,
        updateDetailsGoBackLink
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session: Session = req.session as any as Session;
        const manageUsersDashboard = MANAGE_USERS_DASHBOARD;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;

        if (acspUpdatedFullProfile) {
            session.deleteExtraData(ACSP_DETAILS_UPDATED);
            Object.keys(ACSP_UPDATE_CHANGE_DATE).forEach((key) => {
                session.deleteExtraData(key);
            });
        }
        res.redirect(manageUsersDashboard);
    } catch (err) {
        next(err);
    }
};
