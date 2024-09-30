import { Response } from "express";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionData, TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Session } from "@companieshouse/node-session-handler";
import { APPROVED, CLOSED, REJECTED, RESUME_APPLICATION_ID } from "../common/__utils/constants";
import { BASE_URL, CANNOT_REGISTER_AGAIN, CANNOT_SUBMIT_ANOTHER_APPLICATION, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../types/pageURL";
import logger from "../utils/logger";
import { deleteAcspApplication } from "./acspRegistrationService";
import { ErrorService } from "./errorService";

export const getRedirectionUrl = async (transactionlistResource: Resource<TransactionList>, session: Session, res: Response, locales:any, lang:string): Promise<string> => {
    const transactionList = transactionlistResource.resource;
    const length = transactionList!.items.length;
    for (let i = 0; i < length; i++) {
        logger.debug("element------>" + transactionList!.items[i].id);
    }
    const transaction: TransactionData = transactionList!.items[0];
    logger.debug("transactionId: " + transaction?.id);
    const applicationId = getApplicationId(transaction!);
    logger.debug("applicationId :" + applicationId);

    var url = "";
    if (transaction?.status !== CLOSED) {
        logger.debug("application is open");
        session.setExtraData(RESUME_APPLICATION_ID, applicationId);
        url = BASE_URL + SAVED_APPLICATION;
    } else if (transaction.filings![transaction.id + "-1"]?.status === REJECTED) {
        logger.debug("application is rejected");
        try {
            await deleteAcspApplication(session, applicationId);
            url = BASE_URL + TYPE_OF_BUSINESS;
        } catch (error) {
            logger.error("Error deleting ACSP application ");
            const exception = new ErrorService();
            exception.renderErrorPage(res, locales, lang, BASE_URL + CHECK_SAVED_APPLICATION);
        }
    } else if (transaction.filings![transaction.id + "-1"]?.status === APPROVED) {
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
    const applicationId = acspId![1];
    return applicationId;
};
