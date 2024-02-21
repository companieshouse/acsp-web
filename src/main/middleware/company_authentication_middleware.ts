import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../config";
import { Session } from "@companieshouse/node-session-handler";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const COMPANY_NUMBER = "12345678";
    const session: Session = req.session as any as Session;
    const companyNumber = "";

    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
