import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../../../../../lib/nationalityList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import * as config from "../../../config";
import { SOLE_TRADER_DATE_OF_BIRTH, BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Answers } from "../../../model/Answers";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData, Nationality } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";
import { AcspDataService } from "../../../services/acspDataService";

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

        const payload = {
            nationality_input_0: acspData.nationality?.firstNationality,
            nationality_input_1: acspData.nationality?.secondNationality,
            nationality_input_2: acspData.nationality?.thirdNationality
        };

        res.render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            nationalityList: nationalityList,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName,
            nationality: acspData?.nationality,
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
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH, lang);
        const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY;
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                nationalityList: nationalityList,
                payload: req.body,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                ...pageProperties

            });// determined from user not in banned list
        } else {

            let nationalityString = req.body.nationality_input_0;
            if (req.body.nationality_input_1 !== "") {
                nationalityString += ", " + req.body.nationality_input_1;
            }
            if (req.body.nationality_input_2 !== "") {
                nationalityString += ", " + req.body.nationality_input_2;
            }

            const nationalityData: Nationality = {
                firstNationality: req.body.nationality_input_0,
                secondNationality: req.body.nationality_input_1,
                thirdNationality: req.body.nationality_input_2
            };

            if (acspData) {
                acspData.nationality = nationalityData;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.nationality = nationalityString;
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);

            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang));

        }
    } catch (error) {
        next(error);
    }
};
