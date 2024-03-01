import { NextFunction, Request, Response, Router } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL, SOLE_TRADER_DATE_OF_BIRTH, SOLE_TRADER } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { UserData } from "../../../model/UserData";
import logger from "../../../../../lib/Logger";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    res.render(config.SOLE_TRADER_NAME, {
        title: "What is your name?",
        previousPage: BASE_URL + SOLE_TRADER
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_NAME, {
                title: "What is your name?",
                previousPage: BASE_URL + SOLE_TRADER,
                pageProperties: pageProperties,
                payload: req.body
            });
        } else {
            const session: Session = req.session as any as Session;
            const userData : UserData = {
                firstName: req.body["first-name"],
                lastName: req.body["last-name"]
            };
            if (session) {
                session.setExtraData(USER_DATA, userData);
            }
            res.redirect(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
