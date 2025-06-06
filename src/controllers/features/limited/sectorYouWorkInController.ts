import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_SECTOR_YOU_WORK_IN, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM, BASE_URL, LIMITED_WHICH_SECTOR_OTHER, LIMITED_WHAT_IS_YOUR_EMAIL } from "../../../types/pageURL";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { SUBMISSION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../utils/logger";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + LIMITED_SECTOR_YOU_WORK_IN;
    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.applicationId);
        saveDataInSession(req, USER_DATA, acspData);
        let workSector;
        if (acspData.workSector === "EA" || acspData.workSector === "HVD" || acspData.workSector === "CASINOS") {
            workSector = "OTHER";
        } else {
            workSector = acspData.workSector;
        }

        res.render(config.SECTOR_YOU_WORK_IN, {
            previousPage: addLangToUrl(getPreviousPage(acspData), lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            workSector
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        next(err);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl: string = BASE_URL + LIMITED_SECTOR_YOU_WORK_IN;
    try {
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const acspData : AcspData = session?.getExtraData(USER_DATA)!;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SECTOR_YOU_WORK_IN, {
                previousPage: addLangToUrl(getPreviousPage(acspData), lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else if (req.body.sectorYouWorkIn === "OTHER") {
            res.redirect(addLangToUrl(BASE_URL + LIMITED_WHICH_SECTOR_OTHER, lang));
        } else {
            // save data to mongodb
            acspData.workSector = req.body.sectorYouWorkIn;
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + LIMITED_WHAT_IS_YOUR_EMAIL, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};

const getPreviousPage = (acspData: AcspData): string => {
    const applicantDetails = acspData.applicantDetails || {};
    let previousPage: string;
    if (JSON.stringify(applicantDetails.correspondenceAddress) === JSON.stringify(acspData.registeredOfficeAddress)) {
        previousPage = BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS;
    } else {
        previousPage = BASE_URL + LIMITED_CORRESPONDENCE_ADDRESS_CONFIRM;
    }
    return previousPage;
};
