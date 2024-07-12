import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl, getLocalesService } from "../../../utils/localise";
import { BASE_URL, CANNOT_SUBMIT_ANOTHER_APPLICATION, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { getSavedApplication } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const savedApplication = await getSavedApplication(session, res.locals.userId);
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    if (savedApplication.status === 404) {
        // Direct to start a new journey if no application found or application was rejected
        saveDataInSession(req, "resume_application", false);
        res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
    } else if (savedApplication.status === 204) {
        // Application found and can be resumed
        res.redirect(addLangToUrl(BASE_URL + SAVED_APPLICATION, lang));
    } else if (savedApplication.status === 403) {
        // Application found and cannot be resumed
        res.redirect(addLangToUrl(BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION, lang));
    } else {
        logger.error(`internal server error: ` + savedApplication.status);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
    }
};
