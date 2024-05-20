import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../../../../../lib/nationalityList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { SOLE_TRADER_DATE_OF_BIRTH, BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Answers } from "../../../model/Answers";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/error/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
            title: "What is your nationality?",
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            nationalityList: nationalityList,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName

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
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang);
        const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY;
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
                previousPage,
                title: "What is your nationality?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                nationalityList: nationalityList,
                pageProperties: pageProperties,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName

            });// determined from user not in banned list
        } else {
            // If validation passes, redirect to the next page
            let nationalityString = req.body.nationality_input_0;
            if (req.body.nationality_input_1 !== "") {
                nationalityString += ", " + req.body.nationality_input_1;
            }
            if (req.body.nationality_input_2 !== "") {
                nationalityString += ", " + req.body.nationality_input_2;
            }
            if (acspData) {
                // Need to change
                acspData.nationality = req.body.nationality_input_0;
            }
            try {
            //  save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.nationality = nationalityString;
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);

                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang));
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, previousPage, currentUrl);
            }
        }
    } catch (error) {
        next(error);
    }
};
