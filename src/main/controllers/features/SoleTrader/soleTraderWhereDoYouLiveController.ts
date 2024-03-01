import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import countryList from "../../../../../lib/countryList";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { UserData } from "../../../model/UserData";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME } from "../../../types/pageURL";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session?.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_WHERE_DO_YOU_LIVE, {
        countryList: countryList,
        title: "Where do you live?",
        previousPage: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY,
        firstName: userData?.firstName,
        lastName: userData?.lastName
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
                previousPage: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY
            });
        } else {
            res.redirect(BASE_URL + SOLE_TRADER_WHAT_IS_THE_BUSINESS_NAME);
        }
    } catch (error) {
        next(error);
    }
};

const getPageProperties = (errors?: FormattedValidationErrors) => ({
    errors
});
