import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { ACSPServiceClient } from "../../../clients/ASCPServiceClient";
import { BASE_URL, LIMITED_CONFIRM_COMPANY, LIMITED_ONE_LOGIN_PASSWORD } from "../../../types/pageURL";

const acspServiceClientOne = new ACSPServiceClient("http://localhost:18642/acsp-api");

export const get = async (req: Request, res: Response) => {
    res.render(config.LIMITED_COMPANY_NUMBER, {
        title: "What is the company number?",
        previousPage: BASE_URL + LIMITED_ONE_LOGIN_PASSWORD
    });
};

export const post = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errors.array()));
            res.status(400).render(config.LIMITED_COMPANY_NUMBER, {
                pageProperties,
                payload: req.body,
                title: "What is the company number?",
                previousPage: BASE_URL + LIMITED_ONE_LOGIN_PASSWORD
            });
        } else {
            const { companyNumber } = req.body;
            await acspServiceClientOne.getCompany(companyNumber);
            res.redirect(BASE_URL + LIMITED_CONFIRM_COMPANY);
        }
    } catch (error) {
        res.status(404).render(config.LIMITED_COMPANY_NUMBER, {
            // pageProperties: getPageProperties({ companyNumber: 'An error occurred while checking company existence' }),
            payload: req.body,
            title: "What is the company number?",
            previousPage: BASE_URL + LIMITED_ONE_LOGIN_PASSWORD
        });
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
