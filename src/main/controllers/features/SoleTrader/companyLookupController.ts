import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import axios from "axios";
import { ACSPServiceClient } from "../../../clients/ASCPServiceClient";

const acspServiceClientOne = new ACSPServiceClient("http://localhost:18642/acsp-api");

export const get = async (req: Request, res: Response) => {
    res.render(config.SOLE_TRADER_COMPANY_NUMBER, {
        title: "What is the company number?",
        previousPage: "/sole-trader/one-login-enter-password"
    });
};

export const post = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errors.array()));
            res.status(400).render(config.SOLE_TRADER_COMPANY_NUMBER, {
                pageProperties,
                payload: req.body,
                title: "What is the company number?",
                previousPage: "/sole-trader/one-login-enter-password"
            });
        } else {
            const { companyNumber } = req.body;
            await acspServiceClientOne.getCompany(companyNumber);
            res.redirect("/sole-trader/date-of-birth");
        }
    } catch (error) {
        res.status(404).render(config.SOLE_TRADER_COMPANY_NUMBER, {
            // pageProperties: getPageProperties({ companyNumber: 'An error occurred while checking company existence' }),
            payload: req.body,
            title: "What is the company number?",
            previousPage: "/sole-trader/one-login-enter-password"
        });
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
