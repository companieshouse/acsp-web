import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../../lib/countryList";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
        countryList: countryList,
        title: "Where do you live?",
        previousPage: BASE_URL + "/sole-trader/nationality",
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
                countryList: countryList,
                pageProperties: pageProperties,
                title: "Where do you live?",
                previousPage: BASE_URL + "/sole-trader/nationality",
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.redirect(BASE_URL + "/sole-trader/business-name");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
