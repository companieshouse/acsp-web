import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, CLOSE_DESCRIPTION, CLOSE_REFERENCE, CLOSE_SUBMISSION_ID } from "../../common/__utils/constants";
import { postTransaction } from "../transactions/transaction_service";
import logger from "../../utils/logger";
import { postAcspRegistration } from "../../services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export class AcspCloseService {
    async createTransaction (session: Session): Promise<void> {
        const existingTransactionId = session.getExtraData(CLOSE_SUBMISSION_ID);
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            try {
                const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
                const transaction = await postTransaction(session, CLOSE_DESCRIPTION, CLOSE_REFERENCE, acspDetails.name);
                session.setExtraData(CLOSE_SUBMISSION_ID, transaction.id);
                return Promise.resolve();
            } catch (error) {
                logger.error(`Error while creating transaction for close ACSP`);
                return Promise.reject(error);
            }
        }
    }

    async saveCloseDetails (session: Session, acspDetails: AcspFullProfile): Promise<void> {
        try {
            const transactionId: string = session.getExtraData(CLOSE_SUBMISSION_ID)!;

            const acspData: AcspData = {
                acspType: "CLOSE_ACSP",
                acspId: acspDetails.number
            };

            await postAcspRegistration(session, transactionId, acspData, true);
        } catch (error) {
            logger.error("Error while saving close details for ACSP");
            return Promise.reject(error);
        }
    }
}
