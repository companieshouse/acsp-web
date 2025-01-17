import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { BASE_URL, LIMITED_SECTOR_YOU_WORK_IN, LIMITED_SELECT_AML_SUPERVISOR, LIMITED_WHAT_IS_YOUR_EMAIL, LIMITED_WHICH_SECTOR_OTHER } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { validationResult } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { AcspDataService } from "../../../services/acspDataService";
import { ErrorService } from "../../../services/errorService";
import logger from "../../../utils/logger";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { http401ErrorHandler } from "../../errorController";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL;
    const session: Session = req.session as any as Session;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        let payload = {};
        if (acspData.applicantDetails?.correspondenceEmail === res.locals.userEmail) {
            payload = {
                whatIsYourEmailRadio: acspData.applicantDetails?.correspondenceEmail
            };
        } else if (acspData.applicantDetails?.correspondenceEmail) {
            payload = {
                whatIsYourEmailRadio: "A Different Email",
                whatIsYourEmailInput: acspData.applicantDetails?.correspondenceEmail
            };
        }

        res.render(config.WHAT_IS_YOUR_EMAIL, {
            ...getLocaleInfo(locales, lang),
            previousPage: addLangToUrl(getPreviousPage(acspData?.workSector), lang),
            currentUrl,
            loginEmail: res.locals.userEmail,
            businessName: acspData?.businessName,
            typeOfBusiness: acspData?.typeOfBusiness,
            payload
        });
    } catch (err: any) {
        const httpStatusCode = err.httpStatusCode;
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        if (httpStatusCode === 401) {
            http401ErrorHandler(err, req, res, next);
        } else {
            const error = new ErrorService();
            error.renderErrorPage(res, locales, lang, currentUrl);
        }
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL;
    try {
        const errorList = validationResult(req);
        const session: Session = req.session!;
        const acspData: AcspData = session.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(getPreviousPage(acspData?.workSector), lang);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            return res.status(400).render(config.WHAT_IS_YOUR_EMAIL, {
                ...getLocaleInfo(locales, lang),
                ...pageProperties,
                previousPage,
                currentUrl,
                loginEmail: res.locals.userEmail,
                businessName: acspData?.businessName,
                typeOfBusiness: acspData?.typeOfBusiness,
                payload: req.body
            });
        } else {
            if (acspData) {
                const applicantDetails = acspData.applicantDetails || {};
                let correspondenceEmail;
                if (req.body.whatIsYourEmailRadio === "A Different Email") {
                    correspondenceEmail = req.body.whatIsYourEmailInput;
                } else {
                    correspondenceEmail = req.body.whatIsYourEmailRadio;
                }
                applicantDetails.correspondenceEmail = correspondenceEmail;
                acspData.applicantDetails = applicantDetails;
            }

            //  save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            res.redirect(addLangToUrl(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR, lang));

        }
    } catch (err: any) {
        const httpStatusCode = err.httpStatusCode;
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        if (httpStatusCode === 401) {
            http401ErrorHandler(err, req, res, next);
        } else {
            const error = new ErrorService();
            error.renderErrorPage(res, locales, lang, currentUrl);
        }
    }
};

const getPreviousPage = (workSector: string | undefined): string => {
    let previousPage: string;
    if (workSector === "EA" || workSector === "HVD" || workSector === "CASINOS") {
        previousPage = BASE_URL + LIMITED_WHICH_SECTOR_OTHER;
    } else {
        previousPage = BASE_URL + LIMITED_SECTOR_YOU_WORK_IN;
    }
    return previousPage;
};
