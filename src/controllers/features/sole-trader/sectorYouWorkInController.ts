import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, BASE_URL, SOLE_TRADER_WHICH_SECTOR_OTHER, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../types/pageURL";
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
    const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, lang);
    const currentUrl: string = BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN;

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
            previousPage,
            ...getLocaleInfo(locales, lang),
            currentUrl,
            firstName: acspData?.applicantDetails?.firstName,
            lastName: acspData?.applicantDetails?.lastName,
            acspType: acspData?.typeOfBusiness,
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
    const currentUrl: string = BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN;
    try {
        const previousPage: string = addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, lang);
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const acspType = acspData?.typeOfBusiness;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SECTOR_YOU_WORK_IN, {
                previousPage,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                firstName: acspData?.applicantDetails?.firstName,
                lastName: acspData?.applicantDetails?.lastName,
                acspType: acspType,
                ...pageProperties
            });
        } else if (req.body.sectorYouWorkIn === "OTHER") {
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER, lang));
        } else {
            // save data to mongodb
            acspData.workSector = req.body.sectorYouWorkIn;
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        next(err);
    }
};
