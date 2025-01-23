import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../../../utils/localise";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspFullProfile } from "../../../services/acspProfileService";
import { getLoggedInAcspNumber } from "../../../common/__utils/session";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = UPDATE_ACSP_DETAILS_BASE_URL;
    try {
        const acspDetails = await getAcspFullProfile(getLoggedInAcspNumber(session));
        session.setExtraData(ACSP_DETAILS, acspDetails);
        session.setExtraData(ACSP_DETAILS_UPDATED, acspDetails);

        res.render(config.UPDATE_ACSP_DETAILS_HOME, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspDetails.name
        });
    } catch (error) {
        logger.error(JSON.stringify(error));
        const errorService = new ErrorService();
        errorService.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang));
};
