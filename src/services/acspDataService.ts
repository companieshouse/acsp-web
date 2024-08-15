import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { SUBMISSION_ID } from "../common/__utils/constants";
import { postAcspRegistration, putAcspRegistration } from "./acspRegistrationService";
import logger from "../utils/logger";

export class AcspDataService {
    async saveAcspData (session: Session, acspData: AcspData, selectedOption?: string): Promise<void> {
        // eslint-disable-next-line camelcase
        const userId = session?.data?.signin_info?.user_profile?.id!;
        try {
            if (acspData === undefined) {
                acspData = {
                    id: userId,
                    typeOfBusiness: selectedOption
                };
                // save data to mongo for the first time
                await postAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
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
