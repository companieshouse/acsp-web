import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.session.user || {};
    res.render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
        title: "What is the correspondence address?",
        previousPage: "/sole-trader/correspondence-address--lookup",
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
            res.status(400).render(config.SOLE_TRADER_MANUAL_CORRESPONDENCE_ADDRESS, {
                title: "What is the correspondence address?",
                previousPage: "/sole-trader/correspondence-address--lookup",
                pageProperties: pageProperties,
                payload: req.body,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            // Save the correspondence address to session
            req.session.user.correspondenceAddress = {
                propertyDetails: req.body.addressPropertyDetails,
                line1: req.body.addressLine1,
                line2: req.body.addressLine2,
                town: req.body.addressTown,
                county: req.body.addressCounty,
                country: req.body.addressCountry,
                postcode: req.body.addressPostcode
            };
            req.session.save(() => {
                res.redirect(SOLE_TRADER_CORRESPONDENCE_ADDRESS_CONFIRM);
            });
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
