import { Session } from "@companieshouse/node-session-handler";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../../lib/Logger";
import {
    CREATE_DESCRIPTION, REFERENCE
} from "../config";
import { GenericService } from "./generic";
import { postTransaction } from "./transactions/transaction_service";

export class TypeOfBusinessService extends GenericService {
    constructor () {
        super();
        this.viewData.title = "You cannot use this service";
        this.viewData.title = "";
    }

    async createTransaction (req: Request, res: Response, companyNumber: string): Promise<string> {
        const session = req.session as any as Session;
        let transactionId: string = "";
        try {
            await postTransaction(session, CREATE_DESCRIPTION, REFERENCE).then((transaction) => {
                transactionId = transaction.id as string;
            });
            logger.info("Transaction created ---> " + transactionId);
            return Promise.resolve(transactionId);
        } catch (err) {
            logger.error(`register acsp: ${StatusCodes.INTERNAL_SERVER_ERROR} - error while create transaction record for ${companyNumber}`);
            const errorData = this.processServiceException(err);
            return Promise.reject(errorData);
        }
    }
}
