import { Session } from "@companieshouse/node-session-handler";
import { CLOSE_DESCRIPTION, CLOSE_REFERENCE, CLOSE_SUBMISSION_ID } from "../../common/__utils/constants";
import { postTransaction } from "../transactions/transaction_service";
import logger from "../../utils/logger";

export class AcspCloseService {
    async createTransaction (session: Session): Promise<void> {
        const existingTransactionId = session.getExtraData(CLOSE_SUBMISSION_ID);
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            try {
                const transaction = await postTransaction(session, CLOSE_DESCRIPTION, CLOSE_REFERENCE);
                session.setExtraData(CLOSE_SUBMISSION_ID, transaction.id);
                return Promise.resolve();
            } catch (error) {
                logger.error(`Error while creating transaction for close ACSP`);
                return Promise.reject(error);
            }
        }
    }
}
