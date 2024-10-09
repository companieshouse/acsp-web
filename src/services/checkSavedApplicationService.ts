import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionData, TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Session } from "@companieshouse/node-session-handler";
import { APPROVED, CLOSED, REJECTED, RESUME_APPLICATION_ID, SUBMISSION_ID } from "../common/__utils/constants";
import { BASE_URL, CANNOT_REGISTER_AGAIN, CANNOT_SUBMIT_ANOTHER_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../types/pageURL";
import logger from "../utils/logger";

/*
* We are not deleting the old rejected application on the acsp Mongo collection.
* This is because we are filtering out the rejected applications to prevent
* the wrong page being shown after user comes back from a rejected application.
*/

export const getRedirectionUrl = async (savedApplications: Resource<TransactionList>, session: Session): Promise<string> => {
    const transactions = filterRejectedApplications(savedApplications.resource!.items);

    let url = "";
    if (!transactions.length) {
        logger.debug("application is rejected");
        url = BASE_URL + TYPE_OF_BUSINESS;
    } else if (transactions[0].status !== CLOSED) {
        logger.debug("application is open");
        session.setExtraData(RESUME_APPLICATION_ID, getApplicationId(transactions[0]));
        session.setExtraData(SUBMISSION_ID, transactions[0].id);
        url = BASE_URL + SAVED_APPLICATION;
    } else if (transactions[0].filings![transactions[0].id + "-1"]?.status === APPROVED) {
        logger.debug("application is approved");
        url = BASE_URL + CANNOT_REGISTER_AGAIN;
    } else {
        logger.debug("application is in progress");
        url = BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION;
    }
    return url;
};

const getApplicationId = (transaction:TransactionData): string => {
    const acspId = transaction.resumeJourneyUri!.match(/acspId=([^\s]+)/);
    return acspId![1];
};

const filterRejectedApplications = (transactions: TransactionData []) => {
    return transactions.filter((transaction) => {
        if (!transaction.filings) {
            return true;
        }

        if (transaction.filings[transaction.id + "-1"].status === REJECTED) {
            return false;
        }
        return true;
    });
};
