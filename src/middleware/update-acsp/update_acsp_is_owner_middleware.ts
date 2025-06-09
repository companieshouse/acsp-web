import { AccountOwnerError } from "../../errors/accountOwnerError";
import { NextFunction, Request, Response } from "express";
import { getLoggedInAcspRole } from "../../common/__utils/session";
import logger from "../../utils/logger";

export const updateAcspIsOwnerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const acspRole: string = getLoggedInAcspRole(req.session);

    if (!acspRole || acspRole.toUpperCase() !== "OWNER") {
        logger.error("User does not have the correct role");
        throw new AccountOwnerError(`Invalid ACSP role - ${acspRole}`);
    }
    next();
};
