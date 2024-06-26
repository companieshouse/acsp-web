import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import logger, { createAndLogError } from "../../../utils/logger";
import { addLangToUrl, getLocalesService, selectLang } from "../../../utils/localise";
import { BASE_URL, CONFIRMATION, CHECK_YOUR_ANSWERS } from "../../../types/pageURL";
import { SUBMISSION_ID, USER_DATA } from "../../../common/__utils/constants";
import { ErrorService } from "../../../services/errorService";
import { postConfirmationEmail } from "../../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Session;
    const lang = selectLang(req.query.lang);
    const paymentStatus = req.query.status;
    const returnedState = req.query.state;
    const transactionId: string = session.getExtraData(SUBMISSION_ID)!;
    const savedState = session.getExtraData("payment-nonce");
    const acspData: AcspData = session.getExtraData(USER_DATA)!;

    logger.debug(`Returned state: ${returnedState}, saved state: ${savedState}`);

    if (!savedState || savedState !== returnedState) {
        return next(createAndLogError("Returned state does not match saved state, rejecting redirect"));
    }

    if (paymentStatus === "paid") {
        try {
            logger.debug("Transaction id: " + transactionId + " - Payment status: " + paymentStatus + " - redirecting to the confirmation page");
            await postConfirmationEmail(session, acspData.id, transactionId);
            return res.redirect(addLangToUrl(BASE_URL + CONFIRMATION, lang));
        } catch (error) {
            logger.error("Error sending confirmation email " + JSON.stringify(error));
            const errorService = new ErrorService();
            errorService.renderErrorPage(res, getLocalesService(), lang, req.url);
        }
    } else {
        logger.debug("Transaction id: " + transactionId + " - Payment status: " + paymentStatus + " - redirecting to the check your answers page");
        return res.redirect(addLangToUrl(BASE_URL + CHECK_YOUR_ANSWERS, lang));
    }
};
