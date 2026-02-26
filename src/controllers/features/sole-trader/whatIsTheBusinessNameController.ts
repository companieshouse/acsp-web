import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { BASE_URL, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";
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
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);
        let payload = {};
        // Check if business name matches the first name and last name
        if (acspData.businessName === `${acspData.applicantDetails?.firstName} ${acspData.applicantDetails?.lastName}`) {
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
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME;
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;

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
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName
            });
        } else {
            let businessName;
            if (req.body.whatsTheBusinessNameRadio === "A Different Name") {
                businessName = req.body.whatIsTheBusinessNameInput;
            } else {
                businessName = acspData.applicantDetails!.firstName! + " " + acspData.applicantDetails!.lastName!;
            }
            if (acspData) {
                acspData.businessName = businessName;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
