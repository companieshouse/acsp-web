import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl } from "../../../utils/localise";
import { BASE_URL, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getSavedApplication } from "../../../services/acspRegistrationService";
import { logger } from "../../../utils/logger";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const savedApplication = await getSavedApplication(session, res.locals.userId);
    const lang = selectLang(req.query.lang);
    if (savedApplication.status === 404) {
        res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
    } else if (savedApplication.status === 204) {
        res.redirect(addLangToUrl(BASE_URL + SAVED_APPLICATION, lang));
    } else {
        logger.error(`internal server error: ` + savedApplication.status);
    }
};
