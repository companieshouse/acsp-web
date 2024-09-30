import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { APPLICATION_ID, SUBMISSION_ID } from "../common/__utils/constants";
import { postAcspRegistration, putAcspRegistration } from "./acspRegistrationService";
import logger from "../utils/logger";
import { saveDataInSession } from "common/__utils/sessionHelper";

export class AcspDataService {
    async saveAcspData (session: Session, acspData: AcspData, selectedOption?: string): Promise<void> {
        // eslint-disable-next-line camelcase
        const userId = session?.data?.signin_info?.user_profile?.id!;
        try {
            if (acspData === undefined) {
                const { v4: uuidv4 } = require('uuid');
                const applicationId = uuidv4();

                acspData = {
                    id: applicationId,
                    typeOfBusiness: selectedOption
                };
                // save data to mongo for the first time
                await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
                session.setExtraData(APPLICATION_ID,acspData.id);
            } else {
                if (selectedOption !== undefined) {
                    acspData.typeOfBusiness = selectedOption;
                }
                // save data to mongodb
                await putAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            }
        } catch (error) {
            logger.error("Error saving ACSP data " + JSON.stringify(error));
            return Promise.reject(error);
        }
    }
}
