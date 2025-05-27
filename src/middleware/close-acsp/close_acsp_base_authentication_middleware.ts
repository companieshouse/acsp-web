import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../../utils/properties";
import { CLOSE_ACSP_BASE_URL } from "../../types/pageURL";

export const closeAcspBaseAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: CLOSE_ACSP_BASE_URL
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
