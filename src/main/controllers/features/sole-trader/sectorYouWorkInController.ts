import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ACSP_TYPE, USER_DATA } from "../../../common/__utils/constants";
import * as config from "../../../config";
import { ACSPData } from "../../../model/ACSPData";
import { BASE_URL, SOLE_TRADER_AUTO_LOOKUP_ADDRESS, SOLE_TRADER_SECTOR_YOU_WORK_IN, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, SOLE_TRADER_WHICH_SECTOR_OTHER } from "../../../types/pageURL";
import { addLangToUrl, getLocaleInfo, getLocalesService, selectLang } from "../../../utils/localise";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();
    const session: Session = req.session as any as Session;
    const acspType = session?.getExtraData(ACSP_TYPE)!;
    const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
    res.render(config.SECTOR_YOU_WORK_IN, {
        previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, lang),
        title: "Which sector do you work in?",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN,
        firstName: acspData?.firstName,
        lastName: acspData?.lastName,
        acspType: acspType
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();
        const session: Session = req.session as any as Session;
        const acspType = session?.getExtraData(ACSP_TYPE)!;
        const acspData : ACSPData = session?.getExtraData(USER_DATA)!;
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array(), lang));
            res.status(400).render(config.SECTOR_YOU_WORK_IN, {
                previousPage: addLangToUrl(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME, lang),
                title: "Which sector do you work in?",
                ...getLocaleInfo(locales, lang),
                currentUrl: BASE_URL + SOLE_TRADER_SECTOR_YOU_WORK_IN,
                firstName: acspData?.firstName,
                lastName: acspData?.lastName,
                acspType: acspType,
                ...pageProperties
            });
        } else {
            if (req.body.sectorYouWorkIn === "OTHER") {
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_WHICH_SECTOR_OTHER, lang));
            } else {
                res.redirect(addLangToUrl(BASE_URL + SOLE_TRADER_AUTO_LOOKUP_ADDRESS, lang));
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
