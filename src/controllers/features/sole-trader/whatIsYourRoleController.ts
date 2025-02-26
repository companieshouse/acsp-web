import { Request, Response, NextFunction } from "express";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, STOP_NOT_RELEVANT_OFFICER, SOLE_TRADER_WHAT_IS_YOUR_NAME, SOLE_TRADER_WHAT_IS_YOUR_ROLE, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { validationResult } from "express-validator";
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
    const previousPage: string = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE;
    try {
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.WHAT_IS_YOUR_ROLE, {
            ...getLocaleInfo(locales, lang),
            currentUrl,
            previousPage,
            acspType: acspData?.typeOfBusiness,
            roleType: acspData?.roleType
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE;
    try {
        const errorList = validationResult(req);
        const selectedRole = req.body.WhatIsYourRole;
        const previousPage: string = addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang);
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                ...getLocaleInfo(locales, lang),
                currentUrl,
                previousPage,
                acspType: acspData?.typeOfBusiness,
                ...pageProperties
            });

        } else {
            if (acspData) {
                acspData.roleType = req.body.WhatIsYourRole;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            if (selectedRole === "SOLE_TRADER") {
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NAME, lang));
            } else {
                res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
