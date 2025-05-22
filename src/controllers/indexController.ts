import { NextFunction, Request, Response } from "express";
import * as config from "../config";
import { BASE_URL, CHECK_SAVED_APPLICATION, VERIFY_IDENTITY_WITH_GOV_UK_ONE_LOGIN } from "../types/pageURL";
import {
    addLangToUrl,
    getLocaleInfo,
    getLocalesService,
    selectLang
} from "../utils/localise";
import { ACSP01_COST, PIWIK_REGISTRATION_START_GOAL_ID } from "../utils/properties";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    const verifyIdentityGovOneLoginLink = addLangToUrl(VERIFY_IDENTITY_WITH_GOV_UK_ONE_LOGIN, lang);
    const abilityNetAccessibilityLink = "https://mcmw.abilitynet.org.uk/";

    res.render(config.HOME, {
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL,
        PIWIK_REGISTRATION_START_GOAL_ID,
        abilityNetAccessibilityLink,
        ACSP01_COST,
        verifyIdentityGovOneLoginLink
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const lang = selectLang(req.query.lang);
    res.redirect(addLangToUrl(BASE_URL + CHECK_SAVED_APPLICATION, lang));
};
