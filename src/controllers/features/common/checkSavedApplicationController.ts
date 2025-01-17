import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl, getLocalesService } from "../../../utils/localise";
import { BASE_URL, CHECK_SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getSavedApplication } from "../../../services/transactions/transaction_service";
import { getRedirectionUrl } from "../../../services/checkSavedApplicationService";
import { http401ErrorHandler } from "../../errorController";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    try {
        const savedApplication = await getSavedApplication(session, res.locals.userId);

        logger.debug("savedApplication: " + savedApplication);

        if (savedApplication.httpStatusCode === 200) {
            logger.debug("saved application exists");
            const redirectionUrl = await getRedirectionUrl(savedApplication, session);
            res.redirect(addLangToUrl(redirectionUrl, lang));
        } else if (savedApplication.httpStatusCode === 404) {
            logger.debug("its a new application");
            res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
        }
    } catch (error: any) {
        const httpStatusCode = error.httpStatusCode;
        logger.error(JSON.stringify(error));
        if (httpStatusCode === 401) {
            http401ErrorHandler(error, req, res, next);
        } else {
            const exception = new ErrorService(); ;
            exception.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
        }
    }
};
