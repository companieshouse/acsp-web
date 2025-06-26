import { NextFunction, Request, Response } from "express";
import { addLangToUrl, selectLang } from "../../utils/localise";
import { getLoggedInAcspNumber } from "../../common/__utils/session";
import { MUST_BE_AUTHORISED_AGENT, UPDATE_ACSP_DETAILS_BASE_URL } from "../../types/pageURL";

export const updateAcspUserIsPartOfAcspMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const acspNumber: string = getLoggedInAcspNumber(req.session);
        if (!acspNumber) {
            if (!req.originalUrl.includes(MUST_BE_AUTHORISED_AGENT)) {
                res.redirect(addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + MUST_BE_AUTHORISED_AGENT, lang));
                return;
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
