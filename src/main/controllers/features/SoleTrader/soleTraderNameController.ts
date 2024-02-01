import { NextFunction, Request, Response, Router } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_NAME, {
        title: "What is your name?",
        previousPage: "/sole-trader/"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_NAME, {
                title: "What is your name?",
                previousPage: "/sole-trader/",
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            res.redirect("/sole-trader/date-of-birth");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
