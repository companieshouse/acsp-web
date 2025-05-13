import { CLOSE_ACSP_BASE_URL, AUTHORISED_AGENT } from "../../types/pageURL";
import { Handler } from "express";
import { addLangToUrl } from "../../utils/localise";

/**
 * Populates variables for use in templates that are used on multiple pages.
 * All variables in res.locals will be availble for use in templates.
 * e.g. res.locals.userEmail can be used as {{userEmail}} in the template.
 *
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const closeVariablesMiddleware: Handler = (req, res, next) => {

    res.locals.serviceName = "Close the authorised agent account";
    res.locals.serviceUrl = CLOSE_ACSP_BASE_URL;
    res.locals.tabTitleKey = "CommonTabTitleCloseAcsp";
    res.locals.authorisedAgentDashboardUrl = addLangToUrl(AUTHORISED_AGENT, res.locals.lang);

    next();
};
