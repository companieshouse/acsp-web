import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_NAME_REGISTERED_WITH_AML, LIMITED_WHAT_IS_YOUR_ROLE, BASE_URL, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS } from "../../../types/pageURL";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { Session } from "@companieshouse/node-session-handler";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang);
    const currentUrl: string = BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);
        res.render(config.LIMITED_NAME_REGISTERED_WITH_AML, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            businessName: acspData?.businessName,
            nameRegisteredWithAml: acspData?.howAreYouRegisteredWithAml
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML;
    try {
        const errorList = validationResult(req);
        const selectedOption = req.body.nameRegisteredWithAml;
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_ROLE, lang);
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.LIMITED_NAME_REGISTERED_WITH_AML, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                businessName: acspData?.businessName,
                ...pageProperties
            });
        } else {
            if (acspData) {
                //  save data to mongodb
                acspData.howAreYouRegisteredWithAml = req.body.nameRegisteredWithAml;
                const acspDataService = new AcspDataService();
                await acspDataService.saveAcspData(session, acspData);
            }

            if (selectedOption === "NAME_OF_THE_BUSINESS") {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, lang));
            } else {
                res.redirect(addLangToUrl(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
