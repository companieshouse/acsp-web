import { NextFunction, Request, Response } from "express";
import { selectLang, addLangToUrl } from "../../../utils/localise";
import { BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../../utils/logger";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { getSavedApplication } from "../../../services/transactions/transaction_service";
import { getRedirectionUrl } from "../../../services/checkSavedApplicationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
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
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};
