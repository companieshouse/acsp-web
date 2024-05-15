import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { createAndLogError, logger } from "../../../utils/logger";
import { addLangToUrl, selectLang } from "../../../utils/localise";
import { BASE_URL, CONFIRMATION, CHECK_YOUR_ANSWERS } from "../../../types/pageURL";
import { SUBMISSION_ID } from "../../../common/__utils/constants";

export const get = (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = req.session as Session;
        const lang = selectLang(req.query.lang);
        const paymentStatus = req.query.status;
        const returnedState = req.query.state;
        const transactionId: string = session.getExtraData(SUBMISSION_ID)!;
        const savedState = session.getExtraData("payment-nonce");

        logger.debug(`Returned state: ${returnedState}, saved state: ${savedState}`);

        if (!savedState || savedState !== returnedState) {
            return next(createAndLogError("Returned state does not match saved state, rejecting redirect"));
        }

        if (paymentStatus === "paid") {
            logger.debug("Transaction id: " + transactionId + " - Payment status: " + paymentStatus + " - redirecting to the confirmation page");
            return res.redirect(addLangToUrl(BASE_URL + CONFIRMATION, lang));
        } else {
            logger.debug("Transaction id: " + transactionId + " - Payment status: " + paymentStatus + " - redirecting to the check your answers page");
            return res.redirect(addLangToUrl(BASE_URL + CHECK_YOUR_ANSWERS, lang));
        }
    } catch (e) {
        return next(e);
    }
};
