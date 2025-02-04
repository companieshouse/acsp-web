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
    res.locals.serviceUrl = "/view-and-update-the-authorised-agents-details";

    next();
};
