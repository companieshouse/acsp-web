import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../../../../../lib/nationalityList";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
        nationalityList: nationalityList,
        title: "What is your nationality?",
        previousPage: "/sole-trader/date-of-birth"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Form submission data:", req.body);
    try {
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
                nationalityList: nationalityList,
                pageProperties: pageProperties,
                title: "What is your nationality?",
                previousPage: "/sole-trader/date-of-birth"
            });// determined from user not in banned list
        } else {
            // If validation passes, redirect to the next page
            res.redirect("/sole-trader/where-do-you-live");
            // if banned user redirect kickoutpage- under construction
            /* res.redirect("/sole-trader/stop-screen-not-a-soletrader"); */
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
