import { NextFunction, Request, Response } from "express";
import { AuthOptions, authMiddleware, acspProfileCreateAuthMiddleware } from "@companieshouse/web-security-node";

import { CHS_URL, FEATURE_FLAG_DISABLE_MANDATORY_VERIFICATION } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../types/pageURL";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: BASE_URL + CHECK_SAVED_APPLICATION
    };

    return FEATURE_FLAG_DISABLE_MANDATORY_VERIFICATION === "true"
        ? authMiddleware(authMiddlewareConfig)(req, res, next)
        : acspProfileCreateAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
