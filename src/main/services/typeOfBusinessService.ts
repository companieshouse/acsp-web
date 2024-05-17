import { Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { postTransaction } from "./transactions/transaction_service";
import { StatusCodes } from "http-status-codes";
import {
    CREATE_DESCRIPTION, REFERENCE
} from "../config";
import logger from "../../../lib/Logger";
import { GenericService } from "./generic";

export class TypeOfBusinessService extends GenericService {
    constructor () {
        super();
        this.viewData.title = "You cannot use this service";
        this.viewData.title = "";
    }

    async createTransaction (req: Request, res: Response): Promise<string> {
        const session = req.session as Session;
        let transactionId: string = "";
        try {
            await postTransaction(session, CREATE_DESCRIPTION, REFERENCE).then((transaction) => {
                transactionId = transaction.id as string;
            });
            logger.info("Transaction created ---> " + transactionId);
            return Promise.resolve(transactionId);
        } catch (err) {
            logger.error(`register acsp: ${StatusCodes.INTERNAL_SERVER_ERROR} - error while create transaction record`);
            const errorData = this.processServiceException(err);
            return Promise.reject(errorData);
        }
    }
}
