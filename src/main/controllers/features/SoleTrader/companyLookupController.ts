import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import axios from "axios";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_COMPANY_NUMBER, {
        title: "What is the company number?",
        previousPage: "/sole-trader/one-login-enter-password"
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Data:", req.body.companyNumber);
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_COMPANY_NUMBER, {
                pageProperties: pageProperties,
                payload: req.body,
                title: "What is the company number?",
                previousPage: "/sole-trader/one-login-enter-password"
            });
        } else {
            const companyNumber = req.body.companyNumber;
            const response = await axios.post("/company/{companyNumber}");
            if (response.status === 200) {
                res.redirect("/sole-trader/confirm-company");
            } else if (response.status === 404) {
            // const pageProperties = getPageProperties({ companyNumber: "Company number does not exist" });
                res.status(400).render(config.SOLE_TRADER_COMPANY_NUMBER, {
                // pageProperties: pageProperties,
                    payload: req.body,
                    title: "What is the company number?",
                    previousPage: "/sole-trader/one-login-enter-password"
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
