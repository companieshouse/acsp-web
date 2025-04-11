import { Handler } from "express";
import { AcspType } from "../model/AcspType";

/**
 * Populates variables for use in templates that are used on multiple pages.
 * All variables in res.locals will be availble for use in templates.
 * e.g. res.locals.userEmail can be used as {{userEmail}} in the template.
 *
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const registrationVariablesMiddleware: Handler = (req, res, next) => {

    res.locals.serviceName = "Apply to register as a Companies House authorised agent";
    res.locals.serviceUrl = "/register-as-companies-house-authorised-agent";
    res.locals.journeyType = AcspType.REGISTER_ACSP;
    res.locals.tabTitleKey = "CommonTabTitle";

    next();
};
