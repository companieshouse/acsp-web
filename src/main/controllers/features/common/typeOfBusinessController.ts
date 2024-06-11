import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { TYPE_OF_BUSINESS, OTHER_TYPE_OF_BUSINESS, SOLE_TRADER_WHAT_IS_YOUR_ROLE, BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../types/pageURL";
import { TypeOfBusinessService } from "../../../services/typeOfBusinessService";
import { SUBMISSION_ID, ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, USER_DATA } from "../../../common/__utils/constants";
import logger from "../../../../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { TypeOfBusiness } from "../../../model/TypeOfBusiness";
import { Answers } from "../../../model/Answers";
import { FEATURE_FLAG_DISABLE_LIMITED_JOURNEY, FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY } from "../../../utils/properties";
import { isActiveFeature } from "../../../utils/feature.flag";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const typeOfBusinessService = new TypeOfBusinessService();
    const session: Session = req.session as any as Session;
    const existingTransactionId = session?.getExtraData(SUBMISSION_ID);
    const previousPage: string = addLangToUrl(BASE_URL, lang);
    const currentUrl: string = BASE_URL + TYPE_OF_BUSINESS;

    // create transaction record
    try {
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            await typeOfBusinessService.createTransaction(req, res).then((transactionId) => {
                // get transaction record data
                saveDataInSession(req, SUBMISSION_ID, transactionId);
            });
        }

        let typeOfBusiness = "";
        // get data from mongo and save to session
        try {
            const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
            if (acspData !== undefined) {
                saveDataInSession(req, USER_DATA, acspData);
                if (acspData.typeOfBusiness === "UNINCORPORATED_ENTITY" || acspData.typeOfBusiness === "CORPORATE_BODY") {
                    typeOfBusiness = "OTHER";
                } else {
                    typeOfBusiness = acspData.typeOfBusiness!;
                }
            }
        } catch (err) {
            logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        }

        res.render(config.TYPE_OF_BUSINESS, {
            previousPage,
            title: locales.i18nCh.resolveNamespacesKeys(lang).typeOfBusinessTitle,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            typeOfBusiness,
            FEATURE_FLAG_DISABLE_LIMITED_JOURNEY: isActiveFeature(FEATURE_FLAG_DISABLE_LIMITED_JOURNEY),
            FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY: isActiveFeature(FEATURE_FLAG_DISABLE_PARTNERSHIP_JOURNEY)
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
    const currentUrl: string = BASE_URL + TYPE_OF_BUSINESS;
    const errorList = validationResult(req);
    const selectedOption = req.body.typeOfBusinessRadio;
    const previousPage: string = addLangToUrl(BASE_URL, lang);
    const session: Session = req.session as any as Session;
    try {

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.TYPE_OF_BUSINESS, {
                previousPage,
                title: locales.i18nCh.resolveNamespacesKeys(lang).typeOfBusinessTitle,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            if (selectedOption !== "OTHER") {
                const typeOfBusinessService = new TypeOfBusinessService();
                await typeOfBusinessService.saveAcspData(session, selectedOption);

                const answersArray: Answers = {
                    typeOfBusiness: TypeOfBusiness[selectedOption as keyof typeof TypeOfBusiness]
                };
                saveDataInSession(req, ANSWER_DATA, answersArray);

                switch (selectedOption) {
                case "LIMITED_COMPANY":
                case "LIMITED_PARTNERSHIP":
                case "LIMITED_LIABILITY_PARTNERSHIP":
                    res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, lang));
                    break;
                case "PARTNERSHIP":
                    res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML, lang));
                    break;
                case "SOLE_TRADER":
                    res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang));
                    break;
                }

            } else {
                res.redirect(addLangToUrl(BASE_URL + OTHER_TYPE_OF_BUSINESS, lang));
            }
        }
    } catch {
        const errorService = new ErrorService();
        errorService.renderErrorPage(res, locales, lang, currentUrl);
    }
};
