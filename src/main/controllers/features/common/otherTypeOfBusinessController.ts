import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML, BASE_URL } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ANSWER_DATA, USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { TypeOfBusiness } from "../../../model/TypeOfBusiness";
import { Answers } from "../../../model/Answers";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { TypeOfBusinessService } from "../../../services/typeOfBusinessService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + OTHER_TYPE_OF_BUSINESS;

    try {
        // get data from mongo and save to session
        let acspData;
        try {
            acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
            if (acspData !== undefined) {
                saveDataInSession(req, USER_DATA, acspData);
            }
        } catch (err) {
            logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        }

        res.render(config.OTHER_TYPE_OF_BUSINESS, {
            previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
            title: locales.i18nCh.resolveNamespacesKeys(lang).otherTypeOfBusinessTitle,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            otherTypeOfBusiness: acspData?.typeOfBusiness
        });

    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }

};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const errorList = validationResult(req);
    const selectedOption = req.body.otherTypeOfBusinessRadio;
    const currentUrl = BASE_URL + OTHER_TYPE_OF_BUSINESS;
    const session: Session = req.session as any as Session;
    try {

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.OTHER_TYPE_OF_BUSINESS, {
                previousPage: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang),
                title: locales.i18nCh.resolveNamespacesKeys(lang).otherTypeOfBusinessTitle,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            const typeOfBusinessService = new TypeOfBusinessService();
            await typeOfBusinessService.saveAcspData(session, selectedOption);

            const answersArray: Answers = {
                typeOfBusiness: TypeOfBusiness[selectedOption as keyof typeof TypeOfBusiness]
            };
            saveDataInSession(req, ANSWER_DATA, answersArray);
            // Redirect to Unincorporated journey] Which name is registered with your Anti-Money Laundering (AML) supervisory body?
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));

        }
    } catch (error) {
        const errorService = new ErrorService();
        errorService.renderErrorPage(res, locales, lang, currentUrl);
    }
};
