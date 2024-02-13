import { Session } from "@companieshouse/node-session-handler";
import { postTransaction } from "../services/transactions/transaction_service";
import { StatusCodes } from "http-status-codes";
import {
    CREATE_DESCRIPTION,
    REFERENCE
} from "../config";
import logger from "../../../lib/Logger";
import { GenericService } from "./generic";

export class IndexService extends GenericService {
    constructor () {
        super();
        this.viewData.title = "You cannot use this service";
        this.viewData.title = "";
    }

    async createTransaction (session: Session, companyNumber: string): Promise<string> {
        let transactionId: string = "";
        try {
            await postTransaction(session, companyNumber, CREATE_DESCRIPTION, REFERENCE).then((transaction) => {
                transactionId = transaction.id as string;
            });
            return Promise.resolve(transactionId);
        } catch (err) {
            logger.error(`register acsp: ${StatusCodes.INTERNAL_SERVER_ERROR} - error while create transaction record for ${companyNumber}`);
            const errorData = this.processServiceException(err);
            return Promise.reject(errorData);
        }
    }
}
