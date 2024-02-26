import { NextFunction, Request, Response } from "express";
import * as config from "../../../config";
import { validationResult } from "express-validator";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import { BASE_URL } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { UserData } from "../../../model/UserData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session?.getExtraData(USER_DATA)!;

    res.render(config.SOLE_TRADER_DOB, {
        title: "What is your date of Birth?",
        previousPage: BASE_URL + "/sole-trader/name",
        firstName: userData?.firstName,
        lastName: userData?.lastName
    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session?.getExtraData(USER_DATA)!;
    try {
        const errorList = validationResult(req);
        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_DOB, {
                title: "What is your date of Birth?",
                previousPage: BASE_URL + "/sole-trader/name",
                pageProperties: pageProperties,
                payload: req.body,
                firstName: userData?.firstName,
                lastName: userData?.lastName
            });
        } else {
            res.redirect(BASE_URL + "/sole-trader/nationality");
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
