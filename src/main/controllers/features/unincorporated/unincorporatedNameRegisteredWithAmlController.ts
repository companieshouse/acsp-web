import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_NAME_REGISTERED_WITH_AML, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_NAME, BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, UNINCORPORATED_AML_SELECTED_OPTION, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

enum NameRegisteredWithAML {
    NAME_OF_THE_BUSINESS = "Name of the business",
    YOUR_NAME = "Your name",
    BOTH = "Name of the business and your name"
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.NAME_REGISTERED_WITH_AML, {
            previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
            ...getLocaleInfo(locales, lang),
            nameRegisteredWithAml: acspData?.howAreYouRegisteredWithAml,
            currentUrl
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML;
    try {
        const errorList = validationResult(req);
        const selectedOption = req.body.nameRegisteredWithAml;
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.NAME_REGISTERED_WITH_AML, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.nameRegisteredWithAML = NameRegisteredWithAML[selectedOption as keyof typeof NameRegisteredWithAML];
            if (selectedOption === "NAME_OF_THE_BUSINESS") {
                detailsAnswers.name = "";
            }
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);
            saveDataInSession(req, UNINCORPORATED_AML_SELECTED_OPTION, selectedOption);

            // Save to MongoDB
            if (acspData) {
                acspData.howAreYouRegisteredWithAml = req.body.nameRegisteredWithAml;
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
            }

            // Redirection logic based on selected option
            if (selectedOption === "NAME_OF_THE_BUSINESS") {
                // User is only supervised under their business name, so redirects to "What is the business name?" page
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang));
            } else {
                // User is supervised under their personal name or both personal and business name, so redirect to the "What is your name?" page
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
