import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { formatValidationError, getPageProperties } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UNINCORPORATED_WHICH_SECTOR, UNINCORPORATED_WHAT_IS_YOUR_ROLE, BASE_URL, UNINCORPORATED_WHICH_SECTOR_OTHER, UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP } from "../../../types/pageURL";
import { Answers } from "../../../model/Answers";
import { ANSWER_DATA } from "../../../common/__utils/constants";
import { SectorOfWork } from "../../../model/SectorOfWork";
import { saveDataInSession } from "../../../common/__utils/sessionHelper";
import { Session } from "node-mocks-http";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    res.render(config.SECTOR_YOU_WORK_IN, {
        previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang),
        title: "Which sector do you work in?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + UNINCORPORATED_WHICH_SECTOR
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const errorList = validationResult(req);
        const session: Session = req.session as any as Session;
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SECTOR_YOU_WORK_IN, {
                previousPage: addLangToUrl(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_ROLE, lang),
                title: "Which sector do you work in?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + UNINCORPORATED_WHICH_SECTOR,
                ...pageProperties
            });
        } else {
            if (req.body.sectorYouWorkIn === "OTHER") {
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_WHICH_SECTOR_OTHER, lang));
            } else {
                const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
                detailsAnswers.workSector = SectorOfWork[req.body.sectorYouWorkIn as keyof typeof SectorOfWork];
                saveDataInSession(req, ANSWER_DATA, detailsAnswers);
                res.redirect(addLangToUrl(BASE_URL + UNINCORPORATED_BUSINESS_ADDRESS_LOOKUP, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};
