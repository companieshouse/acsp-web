import { NextFunction, Request, Response } from "express";
import { AuthOptions, acspProfileCreateAuthMiddleware } from "@companieshouse/web-security-node";

import { CHS_URL } from "../utils/properties";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_ROLE } from "../types/pageURL";

export const authenticationMiddlewareForSoleTrader = (req: Request, res: Response, next: NextFunction) => {

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_ROLE
    };

    return acspProfileCreateAuthMiddleware(authMiddlewareConfig)(req, res, next);

};
