import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NAME, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_DATE_OF_BIRTH } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_DATE_OF_BIRTH;

    try {
        // get data from mongo and save it to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);
        let payload;
        if (acspData.applicantDetails?.dateOfBirth) {
            const dateOfBirth = new Date(acspData.applicantDetails?.dateOfBirth);
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
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            payload
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + SOLE_TRADER_DATE_OF_BIRTH;
    try {
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang);
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_DATE_OF_BIRTH, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName
            });
        } else {
            if (acspData) {
                const dateOfBirth = new Date(
                    req.body["dob-year"],
                    req.body["dob-month"] - 1,
                    req.body["dob-day"]);
                const applicantDetails = acspData.applicantDetails || {};
                applicantDetails.dateOfBirth = dateOfBirth;
                acspData.applicantDetails = applicantDetails;
            }
            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
