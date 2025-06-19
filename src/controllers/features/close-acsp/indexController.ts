import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { CANNOT_USE_SERVICE_WHILE_SUSPENDED, CLOSE_ACSP_BASE_URL, CLOSE_WHAT_WILL_HAPPEN, MANAGE_USERS } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../../../common/__utils/constants";
import { getBusinessName } from "../../../services/common";
import { PIWIK_CLOSE_ACSP_START_GOAL_ID } from "../../../utils/properties";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl = CLOSE_ACSP_BASE_URL;
        const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;

        if (acspDetails.status === "suspended") {
            res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CANNOT_USE_SERVICE_WHILE_SUSPENDED, lang));
            return;
        }

        res.render(config.CLOSE_ACSP_HOME, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            PIWIK_CLOSE_ACSP_START_GOAL_ID,
            businessName: getBusinessName(acspDetails.name),
            manageUsersLink: addLangToUrl(MANAGE_USERS, lang)
        });
    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN, lang));
    } catch (error) {
        next(error);
    }
};
