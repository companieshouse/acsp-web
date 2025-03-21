import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { BASE_URL, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, UNINCORPORATED_WHAT_IS_YOUR_ROLE, UNINCORPORATED_WHICH_SECTOR, STOP_NOT_RELEVANT_OFFICER } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session!;
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.WHAT_IS_YOUR_ROLE, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang),
            currentUrl,
            acspType: acspData?.typeOfBusiness,
            unincorporatedBusinessName: acspData?.businessName,
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
    const currentUrl = BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE;
    try {
        const errorList = validationResult(req);
        const session: Session = req.session!;
        const acspData: AcspData = session.getExtraData(USER_DATA)!;

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            return res.status(400).render(config.WHAT_IS_YOUR_ROLE, {
                ...getLocaleInfo(locales, lang),
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME, lang),
                currentUrl,
                pageProperties: pageProperties,
                payload: req.body,
                acspType: acspData?.typeOfBusiness,
                unincorporatedBusinessName: acspData?.businessName,
                ...pageProperties
            });
        }

        if (req.body.WhatIsYourRole === "SOMEONE_ELSE") {
            res.redirect(addLangToUrl(BASE_URL + STOP_NOT_RELEVANT_OFFICER, lang));
        } else {
            // save data in mongodb
            if (acspData) {
                acspData.roleType = req.body.WhatIsYourRole;
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
            }
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
