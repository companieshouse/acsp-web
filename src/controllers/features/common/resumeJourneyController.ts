import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { Session } from "@companieshouse/node-session-handler";
import { NextFunction, Request, Response } from "express";
import { BASE_URL, TYPE_OF_BUSINESS } from "../../../types/pageURL";
import { APPLICATION_ID, NO_PAYMENT_RESOURCE_ERROR, SUBMISSION_ID } from "../../../common/__utils/constants";
import { selectLang, addLangToUrl } from "../../../utils/localise";
import logger from "../../../utils/logger";
import { getTransactionById } from "../../../services/transactions/transaction_service";
import { startPaymentsSession } from "../../../services/paymentService";
import { PAYMENTS_API_URL } from "../../../utils/properties";
import { PAYMENTS, transactionStatuses } from "../../../config";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = selectLang(req.query.lang);
        const transactionId = req.query.transactionId as string;
        let acspId = req.query.acspId as string | undefined;
        const session: Session = req.session as any as Session;
        logger.infoRequest(req, `Resuming ACSP application - Transaction ID: ${transactionId}, Acsp Id ID: ${acspId}`);

        session.setExtraData(SUBMISSION_ID, transactionId);
        session.setExtraData("resume_application", true);
        const transaction: Transaction = await getTransactionById(session, transactionId);
        if (!acspId) {
            acspId = getApplicationId(transaction);
        }
        session.setExtraData(APPLICATION_ID, acspId);

        if (transaction.status === transactionStatuses.CLOSED_PENDING_PAYMENT) {
            const paymentUrl = PAYMENTS_API_URL + PAYMENTS;
            const paymentResponse: ApiResponse<Payment> = await startPaymentsSession(req, session, paymentUrl,
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
        next(err);
    }
};

const getApplicationId = (transaction: Transaction): string => {
    const resources = transaction.resources!;
    let resource: string;
    for (const key in resources) {
        if (resources[key].kind === "acsp") {
            resource = key;
            break;
        }
    }
    return resource!.split("/authorised-corporate-service-provider-applications/")[1];
};
