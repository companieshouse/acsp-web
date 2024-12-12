import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../../utils/properties";
import { UPDATE_ACSP_DETAILS_BASE_URL } from "../../types/pageURL";

export const updateAcspBaseAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: UPDATE_ACSP_DETAILS_BASE_URL
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
