import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { selectLang, addLangToUrl, getLocalesService, getLocaleInfo } from "../../../utils/localise";
import { UPDATE_YOUR_ANSWERS, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_PROVIDE_AML_DETAILS, UPDATE_ADD_AML_SUPERVISOR } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const locales = getLocalesService();

        res.render(config.UPDATE_PROVIDE_AML_DETAILS, {
            previousPage: addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS, lang),
            ...getLocaleInfo(locales, lang),
            currentUrl: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_PROVIDE_AML_DETAILS,
            updateDetailsGoBackLink: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS,
            addAmlDetails: UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR
        });
    } catch (error) {
        next(error);
    }
};
