import { NextFunction, Request, Response } from "express";
import { acspManageUsersAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../../utils/properties";
import { getLoggedInAcspNumber } from "../../common/__utils/session";
import { CLOSE_ACSP_BASE_URL } from "../../types/pageURL";

export const closeAcspAuthMiddleware = (req: Request, res: Response, next: NextFunction): unknown => {
    const acspNumber: string = getLoggedInAcspNumber(req.session);

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: CLOSE_ACSP_BASE_URL,
        acspNumber
    };

    return acspManageUsersAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
