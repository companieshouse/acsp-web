import { AcspData, AcspDataDto } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { APPLICATION_ID, SUBMISSION_ID, USER_DATA } from "../common/__utils/constants";
import { postAcspRegistration, putAcspRegistration } from "./acspRegistrationService";
import logger from "../utils/logger";

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
                if (selectedOption !== undefined) {
                    acspData = this.typeOfBusinessChange(session, acspData, selectedOption);
                }
                // save data to mongodb
                await putAcspRegistration(session, session.getExtraData(SUBMISSION_ID)!, acspData);
            }
        } catch (error) {
            logger.error("Error saving ACSP data " + JSON.stringify(error));
            return Promise.reject(error);
        }
    }

    typeOfBusinessChange (session:Session, acspData: AcspData, selectedOption: string): AcspData {
        if (acspData.typeOfBusiness !== selectedOption) {
            session.deleteExtraData(USER_DATA);
            const clearedAcspData: AcspData = {
                ...acspData,
                typeOfBusiness: selectedOption,
                registeredOfficeAddress: undefined,
                roleType: undefined,
                verified: undefined,
                businessName: undefined,
                workSector: undefined,
                amlSupervisoryBodies: undefined,
                companyDetails: undefined,
                companyAuthCodeProvided: undefined,
                howAreYouRegisteredWithAml: undefined,
                applicantDetails: undefined
            };
            acspData = clearedAcspData;
        } else {
            acspData.typeOfBusiness = selectedOption;
        }
        return acspData;
    }
}
