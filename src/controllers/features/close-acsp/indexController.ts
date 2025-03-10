import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { CLOSE_ACSP_BASE_URL, CLOSE_ACSP_DETAILS } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import { getAcspFullProfile } from "../../../services/acspProfileService";
import { getLoggedInAcspNumber } from "../../../common/__utils/session";
import { Session } from "@companieshouse/node-session-handler";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const currentUrl = CLOSE_ACSP_BASE_URL;
        const acspDetails = await getAcspFullProfile(getLoggedInAcspNumber(session));

        res.render(config.CLOSE_ACSP_HOME, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspDetails.name
        });
    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_ACSP_DETAILS, lang));
    } catch (error) {
        next(error);
    }
};
