import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, SOLE_TRADER_DATE_OF_BIRTH, SOLE_TRADER_WHAT_IS_YOUR_ROLE, SOLE_TRADER_WHAT_IS_YOUR_NAME } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Answers } from "../../../model/Answers";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const payload = {
            "first-name": acspData.applicantDetails?.firstName,
            "middle-names": acspData.applicantDetails?.middleName,
            "last-name": acspData.applicantDetails?.lastName
        };
        res.render(config.WHAT_IS_YOUR_NAME, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            payload,
            typeOfBusiness: acspData.typeOfBusiness
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
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME;
    const session: Session = req.session as any as Session;
    const acspData : AcspData = session?.getExtraData(USER_DATA)!;
    try {
        const errorList = validationResult(req);
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE, lang);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_NAME, {
                ...getLocaleInfo(locales, lang),
                previousPage,
                currentUrl,
                payload: req.body,
                ...pageProperties,
                typeOfBusiness: acspData.typeOfBusiness
            });
        } else {

            if (acspData) {
                acspData.applicantDetails!.firstName = req.body["first-name"];
                acspData.applicantDetails!.middleName = req.body["middle-names"];
                acspData.applicantDetails!.lastName = req.body["last-name"];
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            saveDataInSession(req, USER_DATA, acspData);

            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.name = req.body["first-name"] + " " + req.body["last-name"];
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);

            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang));

        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
