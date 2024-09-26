import { Response } from "express";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { Session } from "@companieshouse/node-session-handler";
import { APPROVED, CLOSED, REJECTED } from "../common/__utils/constants";
import { BASE_URL, CANNOT_REGISTER_AGAIN, CANNOT_SUBMIT_ANOTHER_APPLICATION, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, TYPE_OF_BUSINESS } from "../types/pageURL";
import logger from "../utils/logger";
import { deleteAcspApplication } from "./acspRegistrationService";
import { ErrorService } from "./errorService";

export const getRedirectionUrl = async (transactionlistResource: Resource<TransactionList>, session: Session, res: Response, locales:any, lang:string): Promise<string> => {
    const transactionList = transactionlistResource.resource;
    const transaction = transactionList?.items[transactionList?.items.length - 1];
    logger.debug("transactionId: " + transaction?.id);
    var url = "";
    if (transaction?.status !== CLOSED) {
        logger.debug("application is open");
        url = BASE_URL + SAVED_APPLICATION;
    } else if (transaction.filings![transaction.id + "-1"]?.status === REJECTED) {
        logger.debug("application is rejected");
        try {
            await deleteAcspApplication(session, res.locals.userId);
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
