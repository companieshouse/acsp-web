import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import {
    selectLang,
    addLangToUrl,
    getLocalesService,
    getLocaleInfo
} from "../../../utils/localise";
import {
    LIMITED_SECTOR_YOU_WORK_IN,
    LIMITED_SELECT_AML_SUPERVISOR,
    BASE_URL,
    LIMITED_WHICH_SECTOR_OTHER
} from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPData } from "../../../model/ACSPData";
import { USER_DATA } from "../../../common/__utils/constants";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.WHICH_SECTOR_OTHER, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
        title: "Which other sector do you work in?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_WHICH_SECTOR_OTHER,
        acspType: acspData?.typeofBusiness,
        whichSectorLink: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang)
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
        const acspType = acspData?.typeofBusiness;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHICH_SECTOR_OTHER, {
                previousPage: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
                title: "Which other sector do you work in?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + LIMITED_WHICH_SECTOR_OTHER,
                acspType: acspType,
                whichSectorLink: addLangToUrl(BASE_URL + LIMITED_SECTOR_YOU_WORK_IN, lang),
                ...pageProperties
            });
        } else {
            res.redirect(addLangToUrl(BASE_URL + LIMITED_SELECT_AML_SUPERVISOR, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
