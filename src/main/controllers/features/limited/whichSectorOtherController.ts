import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_SECTOR_YOU_WORK_IN, LIMITED_SELECT_AML_SUPERVISOR, BASE_URL, LIMITED_WHICH_SECTOR_OTHER } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA, USER_DATA, SUBMISSION_ID, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR, OTHER_WORK_SECTOR } from "../../../common/__utils/constants";
import { SectorOfWork } from "../../../model/SectorOfWork";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "../../../services/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const previousPage: string = addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang);
    const currentUrl: string = BASE_URL + LIMITED_WHICH_SECTOR_OTHER;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userId);
        saveDataInSession(req, USER_DATA, acspData);

        const workSector = session.getExtraData(OTHER_WORK_SECTOR)!;
        res.render(config.WHICH_SECTOR_OTHER, {
            previousPage,
            title: "Which other sector do you work in?",
            ...getLocaleInfo(locales, lang),
            currentUrl,
            acspType: acspData?.typeOfBusiness,
            workSector,
            whichSectorLink: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang)
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session?.getExtraData(USER_DATA)!;
        const previousPage: string = addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang);
        const currentUrl: string = BASE_URL + LIMITED_WHICH_SECTOR_OTHER;

        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHICH_SECTOR_OTHER, {
                previousPage,
                title: "Which other sector do you work in?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                acspType: acspData?.typeOfBusiness,
                whichSectorLink: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
                ...pageProperties
            });
        } else {
            saveDataInSession(req, OTHER_WORK_SECTOR, req.body.sectorYouWorkIn);
            if (acspData) {
                acspData.workSector = req.body.whichSectorOther;
            }
            try {
                // save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.workSector = SectorOfWork[req.body.whichSectorOther as keyof typeof SectorOfWork];
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                res.redirect(addLangToUrl(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR, lang));
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, currentUrl);
            }
        }
    } catch (error) {
        next(error);
    }
};
