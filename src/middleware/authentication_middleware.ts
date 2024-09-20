import { NextFunction, Request, Response } from "express";
import { AuthOptions, acspProfileCreateAuthMiddleware, authMiddleware } from "@companieshouse/web-security-node";

import { CHS_URL } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../types/pageURL";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: BASE_URL + CHECK_SAVED_APPLICATION
    };

    return acspProfileCreateAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
