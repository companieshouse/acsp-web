import { NextFunction, Request, Response } from "express";
import { acspManageUsersAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../utils/properties";
import { getLoggedInAcspNumber, getLoggedInAcspRole } from "../common/__utils/session";
import { BASE_URL } from "../types/pageURL";
import logger from "../utils/logger";

export const updateAcspAuthMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    const acspNumber: string = getLoggedInAcspNumber(req.session);
    const acspRole: string = getLoggedInAcspRole(req.session);
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: BASE_URL,
        acspNumber
    };

    if (!acspRole || acspRole.toUpperCase() !== "OWNER") {
        logger.error("User does not have the correct role");
        throw new Error(`Invalid ACSP role - ${acspRole}`);
    }
    return acspManageUsersAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
