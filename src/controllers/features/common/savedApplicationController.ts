import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SAVED_APPLICATION, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { deleteAcspApplication } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { Session } from "@companieshouse/node-session-handler";
import { APPLICATION_ID, RESUME_APPLICATION_ID, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";

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
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + SAVED_APPLICATION;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));

            res.render(config.SAVED_APPLICATION, {
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            const resumeApplicationId: string = session.getExtraData(RESUME_APPLICATION_ID)!;
            logger.debug("resumeApplicationId :" + resumeApplicationId);
            if (req.body.savedApplication === "no") {
                saveDataInSession(req, "resume_application", true);
                session.setExtraData(APPLICATION_ID, resumeApplicationId);
                res.redirect((YOUR_FILINGS));
            } else {
                saveDataInSession(req, "resume_application", false);
                await deleteAcspApplication(session, session.getExtraData(SUBMISSION_ID)!, resumeApplicationId);
                session.deleteExtraData(USER_DATA);
                session.deleteExtraData(SUBMISSION_ID);
                res.redirect((BASE_URL + TYPE_OF_BUSINESS));
            }
        }
    } catch (err) {
        logger.error("Error deleting ACSP application " + JSON.stringify(err));
        next(err);
    }
};
