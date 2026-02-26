import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";
import { PIWIK_UPDATE_ACSP_START_GOAL_ID } from "../../../utils/properties";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL;
        const updateFlag = JSON.stringify(session.getExtraData(ACSP_DETAILS)) !== JSON.stringify(session.getExtraData(ACSP_DETAILS_UPDATED));
        const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

        if (!updateFlag) {
            session.setExtraData(ACSP_DETAILS_UPDATED, acspDetails);
        }
        res.render(config.UPDATE_ACSP_DETAILS_HOME, {
            ...getLocaleInfo(locales, lang),
            PIWIK_UPDATE_ACSP_START_GOAL_ID,
            currentUrl

        });
    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang));
    } catch (error) {
        next(error);
    }
};
