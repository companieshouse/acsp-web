import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { LIMITED_SECTOR_YOU_WORK_IN, LIMITED_NAME_REGISTERED_WITH_AML, BASE_URL, LIMITED_WHICH_SECTOR_OTHER, LIMITED_SELECT_AML_SUPERVISOR } from "../../../types/pageURL";
import { SectorOfWork } from "../../../model/SectorOfWork";
import { Answers } from "../../../model/Answers";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { ANSWER_DATA, SUBMISSION_ID, USER_DATA, GET_ACSP_REGISTRATION_DETAILS_ERROR, POST_ACSP_REGISTRATION_DETAILS_ERROR } from "../../../common/__utils/constants";
import { Session } from "@companieshouse/node-session-handler";
import { getAcspRegistration, postAcspRegistration } from "../../../services/acspRegistrationService";
import logger from "../../../../../lib/Logger";
import { ErrorService } from "main/services/error/errorService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const previousPage = addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang);
    const currentUrl = BASE_URL + LIMITED_SECTOR_YOU_WORK_IN;
    const session: Session = req.session as any as Session;

    try {
        // get data from mongo and save to session
        const acspData = await getAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, res.locals.userEmail);
        saveDataInSession(req, USER_DATA, acspData);

        res.render(config.SECTOR_YOU_WORK_IN, {
            previousPage,
            title: "Which sector do you work in?",
            ...getLocaleInfo(locales, lang),
            currentUrl
        });
    } catch (err) {
        logger.error(GET_ACSP_REGISTRATION_DETAILS_ERROR);
        const error = new ErrorService();
        error.renderErrorPage(res, locales, lang, previousPage, currentUrl);
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        const previousPage = addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang);
        const currentUrl = BASE_URL + LIMITED_SECTOR_YOU_WORK_IN;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));

            res.status(400).render(config.SECTOR_YOU_WORK_IN, {
                previousPage,
                title: "Which sector do you work in?",
                ...getLocaleInfo(locales, lang),
                currentUrl,
                ...pageProperties
            });
        } else {
            const acspData : AcspData = session?.getExtraData(USER_DATA)!;
            if (acspData) {
                acspData.workSector = req.body.sectorYouWorkIn;
            }
            try {
                //  save data to mongodb
                const acspResponse = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);

                if (req.body.sectorYouWorkIn === "OTHER") {
                    res.redirect(addLangToUrl(BASE_URL + LIMITED_WHICH_SECTOR_OTHER, lang));
                } else {
                    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                    detailsAnswers.workSector = SectorOfWork[req.body.sectorYouWorkIn as keyof typeof SectorOfWork];
                    saveDataInSession(req, ANSWER_DATA, detailsAnswers);

                    res.redirect(addLangToUrl(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR, lang));
                }
            } catch (err) {
                logger.error(POST_ACSP_REGISTRATION_DETAILS_ERROR);
                const error = new ErrorService();
                error.renderErrorPage(res, locales, lang, previousPage, currentUrl);
            }
        }
    } catch (error) {
        next(error);
    }
};
