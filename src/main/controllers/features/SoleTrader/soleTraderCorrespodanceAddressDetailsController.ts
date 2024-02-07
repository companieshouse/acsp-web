import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../../../lib/validation/validation";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    res.render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
        title: "What is your name?",
        previousPage: "/sole-trader/",
        addresses: req.session.user.addressList
    }
    );
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_CORRESPONDENCE_ADDRESS_LIST, {
                title: "What is your correspondence address?",
                previousPage: "/sole-trader/auto-lookup-address",
                pageProperties: pageProperties,
                addresses: req.session.user.addressList
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
