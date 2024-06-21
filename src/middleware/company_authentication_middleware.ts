import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../utils/properties";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_NUMBER } from "../common/__utils/constants";

export const companyAuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const companyNumber: string | undefined = session?.getExtraData(COMPANY_NUMBER);
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: req.originalUrl,
        companyNumber: companyNumber
    };
    return authMiddleware(authMiddlewareConfig)(req, res, next);
};
