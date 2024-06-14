import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SAVED_APPLICATION, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ErrorService } from "../../../services/errorService";
import logger from "../../../../../lib/Logger";
import { deleteAcspApplication } from "../../../services/acspRegistrationService";
import { Session } from "@companieshouse/node-session-handler";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SAVED_APPLICATION, {
        ...getLocaleInfo(locales, lang),
        previousPage: addLangToUrl(BASE_URL, lang),
        currentUrl: BASE_URL + SAVED_APPLICATION
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + SAVED_APPLICATION;
    const session: Session = req.session as any as Session;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SAVED_APPLICATION, {
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            if (req.body.savedApplication === "yes") {
                saveDataInSession(req, "resume_application", true);
                res.redirect((YOUR_FILINGS));
            } else {
                saveDataInSession(req, "resume_application", false);
                await deleteAcspApplication(session, res.locals.userId);
                res.redirect((BASE_URL + TYPE_OF_BUSINESS));
            }
        }
    } catch (error) {
        logger.error("Error Deleting application " + JSON.stringify(error));
        const errorService = new ErrorService();
        errorService.renderErrorPage(res, locales, lang, currentUrl);
    }

};
