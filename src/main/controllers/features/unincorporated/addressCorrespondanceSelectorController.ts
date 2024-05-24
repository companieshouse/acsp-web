import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { USER_DATA, UNINCORPORATED_CORRESPONDENCE_ADDRESS, ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { BASE_URL, UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, UNINCORPORATED_SELECT_AML_SUPERVISOR, UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ErrorService } from "../../../services/errorService";
import logger from "../../../../../lib/Logger";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl: string = BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
    try {
        // get data from mongo and save to session
        const acspData: AcspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, lang),
            title: "What is the correspondence address?",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            businessAddress: acspData?.businessAddress,
            payload: req.body

        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
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

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.ADDRESS_CORRESPONDANCE_SELECTOR, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_CONFIRM, lang),
                title: "What is the correspondence address?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS,
                ...pageProperties,
                businessName: acspData?.businessName,
                businessAddress: acspData?.businessAddress,
                payload: req.body
            });
        } else {

            session.setExtraData(UNINCORPORATED_CORRESPONDENCE_ADDRESS, addressOption);
            if (addressOption === "CORRESPONDANCE_ADDRESS") {
                //  save data to mongodb
                acspData.correspondenceAddress = acspData.businessAddress;
                await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

                // Save answers
                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.correspondenceAddress = detailsAnswers.businessAddress;
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);

                // redirect
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_SELECT_AML_SUPERVISOR, lang));
            } else {
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_CORRESPONDENCE_ADDRESS_LOOKUP, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};
