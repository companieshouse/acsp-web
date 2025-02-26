import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_UPDATE_CHANGE_DATE } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage: string = addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang);
    const currentUrl: string = UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE;

    try {
        res.render(config.UPDATE_DATE_OF_THE_CHANGE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const dateOfChange = new Date(
            req.body["change-year"],
            req.body["change-month"] - 1,
            req.body["change-day"]);
        const session: Session = req.session as any as Session;
        const acspData: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;

        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS) === null &&
            acspUpdatedFullProfile.name !== acspData.name) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS, dateOfChange);
        } else if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME) === null &&
            (acspUpdatedFullProfile.soleTraderDetails?.forename !== acspData.soleTraderDetails?.forename ||
            acspUpdatedFullProfile.soleTraderDetails?.otherForenames !== acspData.soleTraderDetails?.otherForenames ||
            acspUpdatedFullProfile.soleTraderDetails?.surname !== acspData.soleTraderDetails?.surname
            )) {
            session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
        }

        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang));
    } catch (err) {
        next(err);
    }
};
