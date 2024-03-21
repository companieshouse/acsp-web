import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import * as config from "../../../config";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, BASE_URL, SOLE_TRADER_WHICH_SECTOR_OTHER, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_TYPE, USER_DATA } from "../../../common/__utils/constants";
import { ACSPData } from "../../../model/ACSPData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspType = session?.getExtraData(ACSP_TYPE)!;
    const ACSPData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.WHICH_SECTOR_OTHER, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
        title: "Which other sector do you work in?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER,
        firstName: ACSPData?.firstName,
        lastName: ACSPData?.lastName,
        acspType: acspType,
        whichSectorLink: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang)
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspType = session?.getExtraData(ACSP_TYPE)!;
        const ACSPData : ACSPData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.WHICH_SECTOR_OTHER, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
                title: "Which other sector do you work in?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER,
                firstName: ACSPData?.firstName,
                lastName: ACSPData?.lastName,
                acspType: acspType,
                whichSectorLink: addLangToUrl(BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN, lang),
                ...pageProperties
            });
        } else {
            res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang));
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
