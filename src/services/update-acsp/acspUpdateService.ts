import { Session } from "@companieshouse/node-session-handler";
import { NEW_AML_BODIES, UPDATE_DESCRIPTION, UPDATE_REFERENCE, UPDATE_SUBMISSION_ID } from "../../common/__utils/constants";
import { postTransaction } from "../transactions/transaction_service";
import logger from "../../utils/logger";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { postAcspRegistration } from "../../services/acspRegistrationService";

export class AcspUpdateService {
    async createTransaction (session: Session): Promise<void> {
        const existingTransactionId = session.getExtraData(UPDATE_SUBMISSION_ID);
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            try {
                const transaction = await postTransaction(session, UPDATE_DESCRIPTION, UPDATE_REFERENCE);
                session.setExtraData(UPDATE_SUBMISSION_ID, transaction.id);
                return Promise.resolve();
            } catch (error) {
                logger.error(`Error while creating transaction for update ACSP`);
                return Promise.reject(error);
            }
        }
    }

    async saveUpdatedDetails (session: Session, acspDetails: AcspFullProfile, acspDetailsUpdated: AcspFullProfile): Promise<void> {
        try {
            const transactionId: string = session.getExtraData(UPDATE_SUBMISSION_ID)!;
            const removedAMLBodies = this.checkForRemovedAMLBodies(acspDetails, acspDetailsUpdated);
            const addedAMLBodies: AmlSupervisoryBody[] | undefined = session.getExtraData(NEW_AML_BODIES);

            const acspData: AcspData = {
                acspType: "UPDATE_ACSP",
                acspId: acspDetails.number,
                applicantDetails: {}
            };

            if (JSON.stringify(acspDetailsUpdated.registeredOfficeAddress) !== JSON.stringify(acspDetails.registeredOfficeAddress)) {
                acspData.registeredOfficeAddress = acspDetailsUpdated.registeredOfficeAddress;
            }
            if (JSON.stringify(acspDetailsUpdated.serviceAddress) !== JSON.stringify(acspDetails.serviceAddress)) {
                acspData.applicantDetails!.correspondenceAddress = acspDetailsUpdated.serviceAddress;
            }
            if (acspDetailsUpdated.email !== acspDetails.email) {
                acspData.applicantDetails!.correspondenceEmail = acspDetailsUpdated.email;
            }
            if (acspDetailsUpdated.name !== acspDetails.name) {
                acspData.businessName = acspDetailsUpdated.name;
            }
            if (acspDetailsUpdated.soleTraderDetails?.usualResidentialCountry !== acspDetails.soleTraderDetails?.usualResidentialCountry) {
                acspData.applicantDetails!.countryOfResidence = acspDetailsUpdated.soleTraderDetails!.usualResidentialCountry;
            }
            if (acspDetailsUpdated.soleTraderDetails?.forename !== acspDetails.soleTraderDetails?.forename ||
                acspDetailsUpdated.soleTraderDetails?.otherForenames !== acspDetails.soleTraderDetails?.otherForenames ||
                acspDetailsUpdated.soleTraderDetails?.surname !== acspDetails.soleTraderDetails?.surname
            ) {
                acspData.applicantDetails!.firstName = acspDetailsUpdated.soleTraderDetails!.forename;
                acspData.applicantDetails!.middleName = acspDetailsUpdated.soleTraderDetails!.otherForenames;
                acspData.applicantDetails!.lastName = acspDetailsUpdated.soleTraderDetails!.surname;
            }

            if (removedAMLBodies.length) {
                acspData.removedAmlSupervisoryBodies = removedAMLBodies;
            }
            if (addedAMLBodies && addedAMLBodies.length) {
                acspData.amlSupervisoryBodies = addedAMLBodies;
            }

            await postAcspRegistration(session, transactionId, acspData);

        } catch (error) {
            logger.error(`Error while creating transaction for update ACSP`);
            return Promise.reject(error);
        }
    }

    private checkForRemovedAMLBodies (acspDetails: AcspFullProfile, acspDetailsUpdated: AcspFullProfile): AmlSupervisoryBody[] {
        const amlBodies = acspDetails.amlDetails;
        const updatedAmlBodies = acspDetailsUpdated.amlDetails;
        const removedAmlBodies: AmlSupervisoryBody[] = [];

        for (let i = 0; i < updatedAmlBodies.length; i++) {
            if (updatedAmlBodies[i].membershipDetails === "" && updatedAmlBodies[i].supervisoryBody === "") {
                removedAmlBodies.push({ amlSupervisoryBody: amlBodies[i].supervisoryBody, membershipId: amlBodies[i].membershipDetails });
            }
        }

        return removedAmlBodies;
    }
}
