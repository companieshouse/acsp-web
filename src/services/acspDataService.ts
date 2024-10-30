import { AcspData, AcspDataDto } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { APPLICATION_ID, RESUME_APPLICATION_ID, SUBMISSION_ID, USER_DATA } from "../common/__utils/constants";
import { deleteAcspApplication, postAcspRegistration, putAcspRegistration } from "./acspRegistrationService";
import logger from "../utils/logger";
import { TypeOfBusinessService } from "./typeOfBusinessService";

export class AcspDataService {
    async saveAcspData (session: Session, acspData: AcspData, selectedOption?: string): Promise<void> {
        try {
            if (acspData === undefined) {
                acspData = {
                    typeOfBusiness: selectedOption
                };
                // save data to mongo for the first time
                const resp = await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData) as unknown;
                const response = resp as AcspDataDto;
                session.setExtraData(APPLICATION_ID, response.id);
            } else {
                // save data to mongodb
                await putAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            }
        } catch (error) {
            logger.error("Error saving ACSP data " + JSON.stringify(error));
            return Promise.reject(error);
        }
    }

    async createNewApplication (session: Session, selectedOption: string): Promise<void> {
        try {
            // delete the old application
            await deleteAcspApplication(session, session.getExtraData(SUBMISSION_ID)!, session.getExtraData(RESUME_APPLICATION_ID)!);
            session.deleteExtraData(USER_DATA);
            session.deleteExtraData(SUBMISSION_ID);
            session.deleteExtraData(RESUME_APPLICATION_ID);
            session.deleteExtraData(APPLICATION_ID);

            // create transaction record
            const typeOfBusinessService = new TypeOfBusinessService();
            await typeOfBusinessService.createTransaction(session).then((transactionId) => {
            // set transaction ID to SUBMISSION_ID session variable
                session.setExtraData(SUBMISSION_ID, transactionId);
            });

            // Save the data to MongoDB
            const acspData = session.getExtraData(USER_DATA)!;
            await this.saveAcspData(session, acspData, selectedOption);
        } catch (error) {
            logger.error("Error creating new application: " + error);
            return Promise.reject(error);
        }
    }
}
