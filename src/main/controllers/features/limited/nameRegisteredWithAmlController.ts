import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_NAME_REGISTERED_WITH_AML, LIMITED_WHAT_IS_YOUR_ROLE, BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.NAME_REGISTERED_WITH_AML, {
            previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang),
            title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
            ...getLocaleInfo(locales, lang),
            currentUrl: BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        res.status(400).render(config.ERROR_404, {
            previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang),
            title: "Page not found",
            ...getLocaleInfo(locales, lang),
            currentUrl: BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML
        });
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const selectedOption = req.body.nameRegisteredWithAml;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.NAME_REGISTERED_WITH_AML, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang),
                title: "Which name is registered with your Anti-Money Laundering (AML) supervisory body?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML,
                ...pageProperties
            });
        } else {
            const session: Session = req.session as any as Session;
            const acspData : AcspData = session?.getExtraData(USER_DATA)!;
            if (acspData) {
                acspData.nameRegisteredWithAml = req.body.nameRegisteredWithAml;
            }
            try {
                //  save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
                const nextPageUrl = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang);
                const nextPageUrlForBoth = addLangToUrl(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, lang);
                if (selectedOption === "YOUR_NAME") {
                    res.redirect(nextPageUrlForBoth); // Redirect to another page when your name selected
                } else {
                    res.redirect(nextPageUrl); // Redirect to the sector page for the other 2 options
                }
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                res.status(400).render(config.ERROR_404, {
                    previousPage: addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang),
                    title: "Page not found",
                    ...getLocaleInfo(locales, lang),
                    currentUrl: BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML
                });
            }
        }
    } catch (error) {
        next(error);
    }
};
