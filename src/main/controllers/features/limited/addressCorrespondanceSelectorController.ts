import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { USER_DATA, SUBMISSION_ID, UNINCORPORATED_CORRESPONDENCE_ADDRESS, ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { BASE_URL, LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, LIMITED_NAME_REGISTERED_WITH_AML, LIMITED_SECTOR_YOU_WORK_IN, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "main/services/error/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang);
    const currentUrl: string = BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
            previousPage,
            title: "What is the correspondence address?",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            businessAddress: acspData?.businessAddress,
            payload: req.body
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, previousPage, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const addressOption = req.body.addressSelectorRadio;
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang);
        const currentUrl: string = BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
                previousPage,
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties,
                businessName: acspData?.businessName,
                businessAddress: acspData?.businessAddress,
                payload: req.body
            });
        } else {
            session.setExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS, addressOption);
            if (addressOption === "CORRESPONDANCE_ADDRESS") {
                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.correspondenceAddress = detailsAnswers.businessAddress;
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                res.redirect(addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang));

                acspData.correspondenceAddress = addressOption;
                try {
                    //  save data to mongodb
                    const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
                } catch (err) {
                    logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                    const error = new ErrorService();
                    error.renderErrorPage(res, locales, lang, previousPage, currentUrl);
                }
            } else {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_LOOKUP, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};
