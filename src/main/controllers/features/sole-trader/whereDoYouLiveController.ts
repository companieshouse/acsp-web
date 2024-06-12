import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../../lib/countryList";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Answers } from "../../../model/Answers";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { ErrorService } from "../../../services/errorService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE;
    const session: Session = req.session as any as Session;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);
        res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
            ...getLocaleInfo(locales, lang),
            previousPage,
            currentUrl,
            countryList: countryList,
            firstName: acspData?.firstName,
            lastName: acspData?.lastName,
            countryInput: acspData?.countryOfResidence
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
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE;
    try {
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, lang);
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                countryList: countryList,
                ...pageProperties
            });
        } else {
            if (acspData) {
                acspData.countryOfResidence = req.body.countryInput;
            }
            //  save data to mongodb
            await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.countryOfResidence = req.body.countryInput;
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
