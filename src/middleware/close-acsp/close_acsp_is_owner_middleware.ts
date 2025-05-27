import { NextFunction, Request, Response } from "express";
import { getLoggedInAcspRole } from "../../common/__utils/session";
import logger from "../../utils/logger";

export const closeAcspIsOwnerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const acspRole: string = getLoggedInAcspRole(req.session);

    if (!acspRole || acspRole.toUpperCase() !== "OWNER") {
        logger.error("User does not have the correct role");
        throw new Error(`Invalid ACSP role - ${acspRole}`);
    }
    next();
};
