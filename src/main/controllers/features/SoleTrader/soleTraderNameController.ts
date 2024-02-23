import { NextFunction, Request, Response, Router } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_NAME, {
        title: "What is your name?",
        previousPage: BASE_URL + "/sole-trader/"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_NAME, {
                title: "What is your name?",
                previousPage: BASE_URL + "/sole-trader/",
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            req.session.user = req.session.user || {};
            req.session.user.firstName = req.body["first-name"];
            req.session.user.lastName = req.body["last-name"];
            req.session.save(() => {
                res.redirect(BASE_URL + "/sole-trader/date-of-birth");
            });
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
