import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NAME, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_DATE_OF_BIRTH } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
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
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_DATE_OF_BIRTH;

    try {
        // get data from mongo and save it to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);
        let payload;
        if (acspData.dateOfBirth) {
            const dateOfBirth = new Date(acspData.dateOfBirth);
            payload = {
                "dob-year": dateOfBirth.getFullYear(),
                "dob-month": dateOfBirth.getMonth() + 1,
                "dob-day": dateOfBirth.getDate()
            };
        }
        res.render(config.SOLE_TRADER_DATE_OF_BIRTH, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName,
            dateOfBirth: acspData?.dateOfBirth,
            payload
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang);
        const currentUrl: string = BASE_URL + SOLE_TRADER_DATE_OF_BIRTH;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_DATE_OF_BIRTH, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName
            });
        } else {
            if (acspData) {
                const dateOfBirth = new Date(
                    req.body["dob-year"],
                    req.body["dob-month"] - 1,
                    req.body["dob-day"]);

                acspData.dateOfBirth = dateOfBirth;
            }
            //  save data to mongodb
            await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.dateOfBirth = new Date(req.body["dob-year"], req.body["dob-month"] - 1, req.body["dob-day"])
                .toLocaleDateString("en-UK", { day: "2-digit", month: "long", year: "numeric" });
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);

            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, lang));

        }
    } catch (error) {
        next(error);
    }
};
