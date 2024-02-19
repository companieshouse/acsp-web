import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    res.render(config.SOLE_TRADER_DOB, {
        title: "What is your date of Birth?",
        previousPage: BASE_URL + "/sole-trader/name",
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
            res.status(400).render(config.SOLE_TRADER_DOB, {
                title: "What is your date of Birth?",
                previousPage: BASE_URL + "/sole-trader/name",
                pageProperties: pageProperties,
                payload: req.body,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.redirect(BASE_URL + "/sole-trader/nationality");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
