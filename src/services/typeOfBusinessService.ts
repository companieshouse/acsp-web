import { Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { postTransaction } from "./transactions/transaction_service";
import { StatusCodes } from "http-status-codes";
import { CREATE_DESCRIPTION, REFERENCE } from "../config";
import logger from "../utils/logger";

export class TypeOfBusinessService {

    async createTransaction (session: Session): Promise<string> {
        let transactionId: string = "";
        try {
            await postTransaction(session, CREATE_DESCRIPTION, REFERENCE).then((transaction) => {
                transactionId = transaction.id as string;
            });
            logger.info("Transaction created ---> " + transactionId);
            return Promise.resolve(transactionId);
        } catch (error) {
            logger.error(`register acsp: ${StatusCodes.INTERNAL_SERVER_ERROR} - error while create transaction record`);
            return Promise.reject(error);
        }
    }
}
