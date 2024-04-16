import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import {
    selectLang,
    addLangToUrl,
    getLocalesService,
    getLocaleInfo
} from "../../../utils/localise";
import {
    BASE_URL,
    LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT,
    LIMITED_NAME_REGISTERED_WITH_AML,
    TYPE_OF_BUSINESS,
    AML_REGISTRATION
} from "../../../types/pageURL";

/**
 * Handler for GET request to Limited Business Must be AML Registered endpoint.
 * Renders the page with relevant data.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
    // Select language based on query parameter
    const lang = selectLang(req.query.lang);

    // Get locales service
    const locales = getLocalesService();

    // Render page with necessary data
    res.render(config.LIMITED_BUSINESS_MUSTBE_AML_REGISTERED, {
        previousPage: addLangToUrl(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML, lang),
        soleTrader: addLangToUrl(BASE_URL + TYPE_OF_BUSINESS + "?typeOfBusiness=SOLE_TRADER", lang),
        amlRegistration: addLangToUrl(AML_REGISTRATION, lang),
        title: "Your business must be registered with an AML supervisory body",
        ...getLocaleInfo(locales, lang),
        currentUrl: BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT
    });
};
