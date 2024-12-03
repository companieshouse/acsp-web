/* eslint-disable camelcase */
import { getLoggedInUserEmail, getLoggedInUserId } from "../common/__utils/session";
import { CHS_MONITOR_GUI_URL } from "../utils/properties";
import { APPLICATION_ID } from "../common/__utils/constants";
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
export const commonTemplateVariablesMiddleware: Handler = (req, res, next) => {
    const session = req.session;

    // Populate user email for use in signout bar.
    const email = getLoggedInUserEmail(session);
    const userId = getLoggedInUserId(session);
    const applicationId = session?.getExtraData(APPLICATION_ID);
    if (email !== undefined) {
        res.locals.userEmail = email;
    }
    if (userId !== undefined) {
        res.locals.userId = userId;
    }
    res.locals.applicationId = applicationId;

    res.locals.chsMonitorGuiUrl = CHS_MONITOR_GUI_URL;

    next();
};
