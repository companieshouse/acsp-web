import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_COMPANY_NUMBER, {
        title: "What is the company number?",
        previousPage: "/sole-trader/one-login-enter-password"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_COMPANY_NUMBER, {
                pageProperties: pageProperties,
                title: "What is the company number?",
                previousPage: "/sole-trader/one-login-enter-password"
            });
        } else {
            res.redirect("/sole-trader/confirm-company");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
