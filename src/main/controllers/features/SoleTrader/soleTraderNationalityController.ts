import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import nationalityList from "../../../../../lib/nationalityList";
import { FormattedValidationErrors, formatValidationError } from "../../../validation/validation";
import * as config from "../../../config";
import { SOLE_TRADER_DATE_OF_BIRTH, BASE_URL, SOLE_TRADER_WHERE_DO_YOU_LIVE } from "../../../types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../../common/__utils/constants";
import { UserData } from "../../../model/UserData";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session.getExtraData(USER_DATA)!;
    res.render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
        nationalityList: nationalityList,
        title: "What is your nationality?",
        previousPage: BASE_URL + SOLE_TRADER_DATE_OF_BIRTH,
        firstName: userData.firstName,
        lastName: userData.lastName

    });
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const userData : UserData = session.getExtraData(USER_DATA)!;

    try {
        const errorList = validationResult(req);

        if (!errorList.isEmpty()) {
            const pageProperties = getPageProperties(formatValidationError(errorList.array()));
            res.status(400).render(config.SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, {
                nationalityList: nationalityList,
                pageProperties: pageProperties,
                title: "What is your nationality?",
                previousPage: BASE_URL + SOLE_TRADER_DATE_OF_BIRTH,
                payload: req.body,
                firstName: userData.firstName,
                lastName: userData.lastName

            });// determined from user not in banned list
        } else {
            // If validation passes, redirect to the next page
            res.redirect(BASE_URL + SOLE_TRADER_WHERE_DO_YOU_LIVE);
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
