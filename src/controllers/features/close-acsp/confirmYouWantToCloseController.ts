import { Request, Response, NextFunction } from "express";
import * as config from "../../../config";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRMATION_ACSP_CLOSED, CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, CLOSE_WHAT_WILL_HAPPEN } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { AcspCloseService } from "../../../services/close-acsp/acspCloseService";
import { ACSP_DETAILS } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        res.render(config.CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN, lang),
            currentUrl: CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE
        });

    } catch (error) {
        next(error);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const session: Session = req.session as any as Session;
        const acspCloseService = new AcspCloseService();
        await acspCloseService.createTransaction(session);
        await acspCloseService.saveCloseDetails(session, session.getExtraData(ACSP_DETAILS)!);
        res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRMATION_ACSP_CLOSED, lang));
    } catch (error) {
        next(error);
    }
};
