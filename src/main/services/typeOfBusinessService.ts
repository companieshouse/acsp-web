import { Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { postTransaction } from "./transactions/transaction_service";
import { StatusCodes } from "http-status-codes";
import {
    CREATE_DESCRIPTION, REFERENCE
} from "../config";
import logger from "../../../lib/Logger";
import { GenericService } from "./generic";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { postAcspRegistration, putAcspRegistration } from "./acspRegistrationService";
import { SUBMISSION_ID, USER_DATA } from "../common/__utils/constants";

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

    async saveAcspData (session: Session, selectedOption: string): Promise<void> {
        // eslint-disable-next-line camelcase
        const email = session?.data?.signin_info?.user_profile?.email!;
        // eslint-disable-next-line camelcase
        const userId = session?.data?.signin_info?.user_profile?.id!;
        let acspData: AcspData = session?.getExtraData(USER_DATA)!;
        try {
            if (acspData === undefined) {
                acspData = {
                    id: userId,
                    typeOfBusiness: selectedOption,
                    email: email
                };
                // save data to mongo for the first time
                await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            } else {
                acspData.id = userId;
                acspData.typeOfBusiness = selectedOption;
                acspData.email = email;
                // save data to mongodb
                await putAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            }
        } catch (error) {
            logger.error("Error saving ACSP data " + JSON.stringify(error));
            return Promise.reject(error);
        }
    }
}
