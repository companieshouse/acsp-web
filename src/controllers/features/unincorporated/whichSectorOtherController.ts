import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, BASE_URL, UNINCORPORATED_WHICH_SECTOR_OTHER } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { Answers } from "../../../model/Answers";
import { SectorOfWork } from "../../../model/BusinessSector";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../utils/logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.WHICH_SECTOR_OTHER, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            workSector: acspData.workSector,
            acspType: acspData?.typeOfBusiness,
            whichSectorLink: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang)
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const currentUrl = BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHICH_SECTOR_OTHER, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
                ...getLocaleInfo(locales, lang),
                currentUrl,
                acspType: acspData?.typeOfBusiness,
                whichSectorLink: addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR, lang),
                ...pageProperties
            });
        } else {
            if (acspData) {
                acspData.workSector = req.body.whichSectorOther;
            }
            // save to MongoDB
            const acspDataService = new AcspDataService();
            await acspDataService.saveAcspData(session, acspData);

            const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
            detailsAnswers.workSector = SectorOfWork[req.body.whichSectorOther as keyof typeof SectorOfWork];
            saveDataInSession(req, ANSWER_DATA, detailsAnswers);
            res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang));
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
