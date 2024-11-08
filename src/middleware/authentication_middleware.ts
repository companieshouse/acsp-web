import { NextFunction, Request, Response } from "express";
import { AuthOptions, authMiddleware, acspProfileCreateAuthMiddleware } from "@companieshouse/web-security-node";
import { isActiveFeature } from "../utils/feature.flag";
import { CHS_URL, FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY } from "../utils/properties";
import { BASE_URL, CHECK_SAVED_APPLICATION } from "../types/pageURL";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const signInInfo: ISignInInfo = req.session?.get<ISignInInfo>(SessionKey.SignInInfo) || {};
    const signedIn: boolean = signInInfo[SignInInfoKeys.SignedIn] === 1;

    let authMiddlewareConfig: AuthOptions;

    if (!signedIn) {
        authMiddlewareConfig = {
            chsWebUrl: CHS_URL,
            returnUrl: BASE_URL + CHECK_SAVED_APPLICATION
        };
    } else {
        authMiddlewareConfig = {
            chsWebUrl: CHS_URL,
            returnUrl: req.originalUrl
        };
    }

    return isActiveFeature(FEATURE_FLAG_VERIFY_SOLE_TRADER_ONLY)
        ? authMiddleware(authMiddlewareConfig)(req, res, next)
        : acspProfileCreateAuthMiddleware(authMiddlewareConfig)(req, res, next);
};
