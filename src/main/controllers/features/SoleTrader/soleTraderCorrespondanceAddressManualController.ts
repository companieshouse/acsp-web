import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDANCE_ADDRESS, {
        title: "What is your correspondance address?",
        previousPage: "/sole-trader/correspondance-address-lookup"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            console.log(pageProperties);
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDANCE_ADDRESS, {
                title: "What is your correspondance address?",
                previousPage: "/sole-trader/correspondance-address--lookup",
                pageProperties: pageProperties,
                payload: req.body
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
