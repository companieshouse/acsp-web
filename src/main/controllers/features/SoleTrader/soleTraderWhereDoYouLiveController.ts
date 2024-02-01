import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../../lib/countryList";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";
import * as config from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
        countryList: countryList,
        title: "Where do you live?",
        previousPage: "/sole-trader/nationality"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
                countryList: countryList,
                pageProperties: pageProperties,
                title: "Where do you live?",
                previousPage: "/sole-trader/nationality"
            });
        } else {
            res.redirect("/sole-trader/business-name");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
