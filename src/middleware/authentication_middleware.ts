import { NextFunction, Request, Response } from "express";
import { AuthOptions, authMiddleware, acspProfileCreateAuthMiddleware } from "@companieshouse/web-security-node";
import { isActiveFeature } from "../utils/feature.flag";
import { CHS_URL, FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../types/pageURL";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: BASE_URL + CHECK_SAVED_APPLICATION
    };

    return isActiveFeature(FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY)
        ? authMiddleware(authMiddlewareConfig)(req, res, next)
        : acspProfileCreateAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
