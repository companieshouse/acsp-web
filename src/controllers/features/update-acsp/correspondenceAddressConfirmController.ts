import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_DATE_OF_THE_CHANGE } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_UPDATE_PREVIOUS_PAGE_URL, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;

        let correspondenceAddress;
        if (session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)) {
            correspondenceAddress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        } else {
            const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
            correspondenceAddress = acspUpdatedFullProfile.type === "sole-trader"
                ? acspUpdatedFullProfile.registeredOfficeAddress
                : acspUpdatedFullProfile.serviceAddress;
        }

        res.render(config.CORRESPONDENCE_ADDRESS_CONFIRM, {
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP, lang),
            editPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_MANUAL, lang),
            cancelUpdateLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
            correspondenceAddress
        });
    } catch (err) {
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM);
        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE, lang));
    } catch (err) {
        next(err);
    }
};
