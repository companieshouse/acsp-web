import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDANCE_ADDRESS, {
        title: "What is your correspondance address?",
        previousPage: "/sole-trader/correspondance-address--lookup",
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
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDANCE_ADDRESS, {
                title: "What is your correspondence address?",
                previousPage: "/sole-trader/correspondance-address--lookup",
                pageProperties: pageProperties,
                payload: req.body,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.redirect("/sole-trader/correspondance-address-confirm");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
