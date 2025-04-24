/* eslint-disable camelcase */
import { getLoggedInUserEmail, getLoggedInUserId, getLoggedInAcspNumber } from "../common/__utils/session";
import { ACCOUNT_URL, CHS_MONITOR_GUI_URL } from "../utils/properties";
import { APPLICATION_ID } from "../common/__utils/constants";
import { Handler } from "express";
import { selectLang } from "../utils/localise";

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
    const acspNumber: string = getLoggedInAcspNumber(req.session);
    if (email !== undefined) {
        res.locals.userEmail = email;
    }
    if (userId !== undefined) {
        res.locals.userId = userId;
    }
    res.locals.applicationId = applicationId;

    res.locals.chsMonitorGuiUrl = CHS_MONITOR_GUI_URL;

    res.locals.accountUrl = ACCOUNT_URL;

    res.locals.lang = selectLang(req.query.lang);

    // Setting value for 'Authorised agent' link to show/hide on navbar
    if (acspNumber !== undefined) {
        res.locals.displayAuthorisedAgent = "yes";
    }

    next();
};
