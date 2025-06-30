import { NextFunction, Request, Response } from "express";
import { addLangToUrl, selectLang } from "../../utils/localise";
import { getLoggedInAcspNumber } from "../../common/__utils/session";
import { CLOSE_ACSP_BASE_URL, MUST_BE_AUTHORISED_AGENT } from "../../types/pageURL";

export const closeAcspUserIsPartOfAcspMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const acspNumber: string = getLoggedInAcspNumber(req.session);
        if (!acspNumber && !req.originalUrl.includes(MUST_BE_AUTHORISED_AGENT)) {
            res.redirect(addLangToUrl(CLOSE_ACSP_BASE_URL + MUST_BE_AUTHORISED_AGENT, lang));
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};
