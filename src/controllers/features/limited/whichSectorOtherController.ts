import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_SECTOR_YOU_WORK_IN, BASE_URL, LIMITED_WHICH_SECTOR_OTHER, LIMITED_WHAT_IS_YOUR_EMAIL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";
import { http401ErrorHandler } from "../../errorController";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang);
    const currentUrl: string = BASE_URL + LIMITED_WHICH_SECTOR_OTHER;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.WHICH_SECTOR_OTHER, {
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            acspType: acspData?.typeOfBusiness,
            workSector: acspData?.workSector,
            whichSectorLink: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang)
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
    const currentUrl: string = BASE_URL + LIMITED_WHICH_SECTOR_OTHER;
    try {
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang);
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHICH_SECTOR_OTHER, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                acspType: acspData?.typeOfBusiness,
                whichSectorLink: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
                ...pageProperties
            });
        } else {
            if (acspData) {
                acspData.workSector = req.body.whichSectorOther;
            }
            // save data to mongodb
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL, lang));
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
