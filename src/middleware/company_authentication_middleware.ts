import { NextFunction, Request, Response } from "express";
import { acspProfileCreateAuthMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../utils/properties";
import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_NUMBER, USER_DATA } from "../common/__utils/constants";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const companyAuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const session: Session = req.session as any as Session;
    const companyNumber: string | undefined = session?.getExtraData(COMPANY_NUMBER);
    const acspData: AcspData = session?.getExtraData(USER_DATA)!;
    const companyAuthCodeProvided = acspData.companyAuthCodeProvided;

    if (companyAuthCodeProvided !== true) {
        const authMiddlewareConfig: AuthOptions = {
            chsWebUrl: CHS_URL,
            returnUrl: req.originalUrl,
            companyNumber: companyNumber
        };
        return acspProfileCreateAuthMiddleware(authMiddlewareConfig)(req, res, next);
    } else {
        next();
    }
};
