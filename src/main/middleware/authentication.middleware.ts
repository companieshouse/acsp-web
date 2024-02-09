import { Request, Response, NextFunction } from "express";
import logger from "../../../lib/Logger";

import {
    SOLE_TRADER_SECTOR_YOU_WORK_IN
} from "../types/pageURL";

import {
    checkUserSignedIn,
    getLoggedInUserEmail
} from "../common/__utils/session";

export const authentication = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!checkUserSignedIn(req.session)) {
            logger.info("User not authenticated, redirecting to sign in page, status_code=302");

            const returnToUrl = getReturnToUrl(req);

            return res.redirect(`/signin?return_to=${returnToUrl}`);
        }
        const userEmail = getLoggedInUserEmail(req.session);
        logger.infoRequest(req, `User (${userEmail}) is signed in`);
        // Using the https://expressjs.com/en/5x/api.html#res.locals to make sure that the email
        // is available within a single request-response cycle and visible in the template.
        res.locals.userEmail = userEmail;
        next();

    } catch (err: any) {
        logger.errorRequest(req, err);
        next(err);
    }
};

function getReturnToUrl (req: Request) {
    const returnToUrl = SOLE_TRADER_SECTOR_YOU_WORK_IN;

    return returnToUrl;
}
