/* import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { CHS_URL } from "../config";
import { COMPANY_NUMBER } from "../constants/app_const";
import { Session } from "@companieshouse/node-session-handler";

export const company_authentication_middleware = (req: Request, res: Response, next: NextFunction) => {

  const session: Session = req.session as Session;
  const companyNumber: string | undefined = session?.getExtraData(COMPANY_NUMBER);

  const authMiddlewareConfig: AuthOptions = {
    chsWebUrl: CHS_URL,
    returnUrl: req.originalUrl,
    companyNumber: companyNumber
  };

  return authMiddleware(authMiddlewareConfig)(req, res, next);
};
*/
