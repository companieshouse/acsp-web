import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);
        let payload = {};
        // Check if business name matches the first name and last name
        if (acspData.businessName === `${acspData.firstName} ${acspData.lastName}`) {
            payload = {
                whatsTheBusinessNameRadio: "USERNAME"
            };
        } else if (acspData.businessName) {
            payload = {
                whatsTheBusinessNameRadio: "A Different Name",
                whatIsTheBusinessNameInput: acspData.businessName
            };
        }

        res.render(config.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName,
            payload
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
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME;
    const session: Session = req.session as any as Session;
    const acspData : AcspData = session?.getExtraData(USER_DATA)!;

    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName
            });
        } else {
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            let businessName;
            if (req.body.whatsTheBusinessNameRadio === "A Different Name") {
                businessName = req.body.whatIsTheBusinessNameInput;
            } else {
                businessName = detailsAnswers.name;
            }
            if (acspData) {
                acspData.businessName = businessName;
            }

            //  save data to mongodb
            await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            detailsAnswers.businessName = businessName;
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);

            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang));

        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
