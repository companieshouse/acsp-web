import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_PROVIDE_AML_DETAILS, UPDATE_ADD_AML_SUPERVISOR, CLOSE_ACSP_BASE_URL } from "../../../types/pageURL";
import { isActiveFeature } from "../../../utils/feature.flag";
import { FEATURE_FLAG_ENABLE_CLOSE_ACSP } from "../../../utils/properties";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        res.render(config.UPDATE_PROVIDE_AML_DETAILS, {
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_PROVIDE_AML_DETAILS,
            updateDetailsGoBackLink: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            addAmlDetails: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR, lang),
            closeAuthorisedAgentLink: addLangToUrl(CLOSE_ACSP_BASE_URL, lang),
            FEATURE_FLAG_ENABLE_CLOSE_ACSP: isActiveFeature(FEATURE_FLAG_ENABLE_CLOSE_ACSP)
        });
    } catch (error) {
        next(error);
    }
};
