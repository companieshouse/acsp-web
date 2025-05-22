import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_FEEDBACK_LINK } from "../../types/pageURL";
import { REQ_TYPE_UPDATE_ACSP } from "../../common/__utils/constants";
import { Handler } from "express";

/**
 * Populates variables for use in templates that are used on multiple pages.
 * All variables in res.locals will be availble for use in templates.
 * e.g. res.locals.userEmail can be used as {{userEmail}} in the template.
 *
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const updateVariablesMiddleware: Handler = (req, res, next) => {

    res.locals.serviceName = "View and update the authorised agent's details";
    res.locals.serviceUrl = UPDATE_ACSP_DETAILS_BASE_URL;
    res.locals.reqType = REQ_TYPE_UPDATE_ACSP;
    res.locals.tabTitleKey = "CommonTabTitleUpdateAcsp";
    res.locals.feedbackLink = UPDATE_FEEDBACK_LINK;

    next();
};
