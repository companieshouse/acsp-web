import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { SUBMISSION_ID, USER_DATA } from "../common/__utils/constants";
import { postAcspRegistration, putAcspRegistration } from "./acspRegistrationService";
import logger from "../../../lib/Logger";

export class SaveService {
    async saveAcspData (session: Session, selectedOption?: string): Promise<void> {
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
                acspData.email = email;
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
