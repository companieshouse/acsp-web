import { Session } from "@companieshouse/node-session-handler";
import { UPDATE_DESCRIPTION, UPDATE_REFERENCE, UPDATE_SUBMISSION_ID } from "../../common/__utils/constants";
import { postTransaction } from "../transactions/transaction_service";
import logger from "../../utils/logger";

export class AcspUpdateService {
    async createTransaction (session: Session): Promise<void> {
        const existingTransactionId = session.getExtraData(UPDATE_SUBMISSION_ID);
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            try {
                const transaction = await postTransaction(session, UPDATE_DESCRIPTION, UPDATE_REFERENCE);
                session.setExtraData(UPDATE_SUBMISSION_ID, transaction.id);
                return Promise.resolve();
            } catch (error) {
                logger.error(`Error while creating transaction for update ACSP`);
                return Promise.reject(error);
            }
        }
    }
}
