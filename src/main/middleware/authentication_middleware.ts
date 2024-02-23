import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../config";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {
        const authMiddlewareConfig: AuthOptions = {
            chsWebUrl: CHS_URL,
            returnUrl: req.originalUrl
        };
        return authMiddleware(authMiddlewareConfig)(req, res, next);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};
