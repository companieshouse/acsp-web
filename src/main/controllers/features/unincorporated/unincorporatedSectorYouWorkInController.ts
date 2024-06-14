import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_WHAT_IS_YOUR_ROLE, BASE_URL, UNINCORPORATED_WHICH_SECTOR_OTHER, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { Answers } from "../../../model/Answers";
import { ANSWER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { SectorOfWork } from "../../../model/SectorOfWork";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { getAcspRegistration } from "../../../services/acspRegistrationService";
import { Session } from "@companieshouse/node-session-handler";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspDataService } from "../../../services/acspDataService";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const currentUrl = BASE_URL + UNINCORPORATED_WHICH_SECTOR;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        let workSector;
        if (acspData.workSector === "ESTATE_AGENTS" || acspData.workSector === "HIGH_VALUE_DEALERS" || acspData.workSector === "CASINOS") {
            workSector = "OTHER";
        } else {
            workSector = acspData.workSector;
        }

        res.render(config.SECTOR_YOU_WORK_IN, {
            previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl,
            workSector
        });
    } catch {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const currentUrl = BASE_URL + UNINCORPORATED_WHICH_SECTOR;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SECTOR_YOU_WORK_IN, {
                title: locales.i18nCh.resolveNamespacesKeys(lang).sectorYouWorkInTitle,
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            if (req.body.sectorYouWorkIn === "OTHER") {
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER, lang));
            } else {

                // save in mongodb
                if (acspData) {
                    acspData.workSector = req.body.sectorYouWorkIn;
                    const acspDataService = new AcspDataService();
                    await acspDataService.saveAcspData(session, acspData);
                }

                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.workSector = SectorOfWork[req.body.sectorYouWorkIn as keyof typeof SectorOfWork];
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang));
            }
        }
    } catch (err) {
        logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR + " " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};
