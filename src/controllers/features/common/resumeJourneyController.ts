import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response } from "express";
import { BASE_URL, RESUME_JOURNEY, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { selectLang, addLangToUrl, getLocalesService } from "../../../utils/localise";
import logger from "../../../utils/logger";
import { NO_PAYMENT_RESOURCE_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { getTransactionById } from "../../../services/transactions/transaction_service";
import { ErrorService } from "../../../services/errorService";
import { startPaymentsSession } from "../../../services/paymentService";
import { PAYMENTS_API_URL } from "../../../utils/properties";
import { PAYMENTS, transactionStatuses } from "../../../config";

export const get = async (req: Request, res: Response) => {
    const lang = selectLang(req.query.lang);
    const transactionId = req.query.transactionId as string;
    const acspId = req.query.acspId;
    const session: Session = req.session as any as Session;
    const infoMsg = `Transaction ID: ${transactionId}, Acsp Id ID: ${acspId}`;
    logger.infoRequest(req, `Resuming ACSP application - ${infoMsg}`);
    session.setExtraData(SUBMISSION_ID, transactionId);
    // eslint-disable-next-line camelcase
    res.locals.userId = session?.data?.signin_info?.user_profile?.id;
    res.locals.applicationId = acspId;

    try {
        const transaction: Transaction = await getTransactionById(session, transactionId);

        if (transaction.status === transactionStatuses.CLOSED_PENDING_PAYMENT) {
            const paymentUrl = PAYMENTS_API_URL + PAYMENTS;
            const paymentResponse: ApiResponse<Payment> = await startPaymentsSession(session, paymentUrl,
                transactionId);

            if (!paymentResponse.resource) {
                throw new Error(NO_PAYMENT_RESOURCE_ERROR);
            }

            res.redirect(paymentResponse.resource.links.journey);

        } else {
            res.redirect(addLangToUrl(BASE_URL + TYPE_OF_BUSINESS, lang));
        }

    } catch (err) {
        logger.error("Error resuming journey " + JSON.stringify(err));
        const error = new ErrorService();
        error.renderErrorPage(res, getLocalesService(), lang, BASE_URL + RESUME_JOURNEY);
    }
};
