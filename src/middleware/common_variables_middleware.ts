/* eslint-disable camelcase */
import { Session } from "@companieshouse/node-session-handler";
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
    // eslint-disable-next-line camelcase
    const email = session?.data?.signin_info?.user_profile?.email;
    const userId = session?.data?.signin_info?.user_profile?.id;
    const applicationId = session?.getExtraData(APPLICATION_ID);
    if (email !== undefined) {
        res.locals.userEmail = email;
    }
    if (userId !== undefined) {
        res.locals.userId = userId;
    }
    res.locals.applicationId = applicationId;

    next();
};
