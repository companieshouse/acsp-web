import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, UPDATE_DESCRIPTION, UPDATE_REFERENCE, UPDATE_SUBMISSION_ID } from "../../common/__utils/constants";
import { postTransaction } from "../transactions/transaction_service";
import logger from "../../utils/logger";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { postAcspRegistration } from "../../services/acspRegistrationService";
import { SupervisoryBodyMapping } from "../../model/SupervisoryBodyMapping";

export class AcspUpdateService {
    async createTransaction (session: Session): Promise<void> {
        const existingTransactionId = session.getExtraData(UPDATE_SUBMISSION_ID);
        if (existingTransactionId === undefined || JSON.stringify(existingTransactionId) === "{}") {
            try {
                const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
                const transaction = await postTransaction(session, UPDATE_DESCRIPTION, UPDATE_REFERENCE, acspDetails.name);
                session.setExtraData(UPDATE_SUBMISSION_ID, transaction.id);
                return Promise.resolve();
            } catch (error) {
                logger.error(`Error while creating transaction for update ACSP`);
                return Promise.reject(error);
            }
        }
    }

    async saveUpdatedDetails (session: Session, acspDetails: AcspFullProfile, acspUpdatedDetails: AcspFullProfile): Promise<void> {
        try {
            const transactionId: string = session.getExtraData(UPDATE_SUBMISSION_ID)!;

            const acspData: AcspData = {
                acspType: "UPDATE_ACSP",
                acspId: acspDetails.number,
                applicantDetails: {}
            };

            if (JSON.stringify(acspDetails.registeredOfficeAddress) !== JSON.stringify(acspUpdatedDetails.registeredOfficeAddress)) {
                acspData.registeredOfficeAddress = acspUpdatedDetails.registeredOfficeAddress;
            }
            if (JSON.stringify(acspDetails.serviceAddress) !== JSON.stringify(acspUpdatedDetails.serviceAddress)) {
                acspData.applicantDetails!.correspondenceAddress = acspUpdatedDetails.serviceAddress;
            }
            if (acspDetails.email !== acspUpdatedDetails.email) {
                acspData.applicantDetails!.correspondenceEmail = acspUpdatedDetails.email;
            }
            if (acspDetails.name !== acspUpdatedDetails.name) {
                acspData.businessName = acspUpdatedDetails.name;
            }
            if (acspDetails.soleTraderDetails?.usualResidentialCountry !== acspUpdatedDetails.soleTraderDetails?.usualResidentialCountry) {
                acspData.applicantDetails!.countryOfResidence = acspUpdatedDetails.soleTraderDetails!.usualResidentialCountry;
            }
            if (acspDetails.soleTraderDetails?.forename !== acspUpdatedDetails.soleTraderDetails?.forename ||
                acspDetails.soleTraderDetails?.otherForenames !== acspUpdatedDetails.soleTraderDetails?.otherForenames ||
                acspDetails.soleTraderDetails?.surname !== acspUpdatedDetails.soleTraderDetails?.surname
            ) {
                acspData.applicantDetails!.firstName = acspUpdatedDetails.soleTraderDetails!.forename;
                acspData.applicantDetails!.middleName = acspUpdatedDetails.soleTraderDetails!.otherForenames;
                acspData.applicantDetails!.lastName = acspUpdatedDetails.soleTraderDetails!.surname;
            }
            if (this.getAddedAmlBodies(acspDetails, acspUpdatedDetails).length > 0) {
                acspData.amlSupervisoryBodies = this.getAddedAmlBodies(acspDetails, acspUpdatedDetails);
            }
            if (this.getRemovedAmlBodies(acspDetails, acspUpdatedDetails).length > 0) {
                acspData.removedAmlSupervisoryBodies = this.getRemovedAmlBodies(acspDetails, acspUpdatedDetails);
            }

            await postAcspRegistration(session, transactionId, acspData);

        } catch (error) {
            logger.error(`Error while saving updated details for update ACSP`);
            return Promise.reject(error);
        }
    }

    private getAddedAmlBodies (acspDetails: AcspFullProfile, acspUpdatedDetails: AcspFullProfile): AmlSupervisoryBody[] {
        const addedBodies: AmlSupervisoryBody[] = [];
        acspUpdatedDetails.amlDetails.forEach(body => {
            if (!acspDetails.amlDetails.find(originalBody => originalBody.supervisoryBody === body.supervisoryBody &&
                originalBody.membershipDetails === body.membershipDetails)) {
                addedBodies.push({
                    amlSupervisoryBody: SupervisoryBodyMapping[body.supervisoryBody as keyof typeof SupervisoryBodyMapping],
                    membershipId: body.membershipDetails
                });
            }
        });
        return addedBodies;
    }

    private getRemovedAmlBodies (acspDetails: AcspFullProfile, acspUpdatedDetails: AcspFullProfile): AmlSupervisoryBody[] {
        const removedBodies: AmlSupervisoryBody[] = [];
        acspDetails.amlDetails.forEach(body => {
            if (!acspUpdatedDetails.amlDetails.find(removedBody => removedBody.supervisoryBody === body.supervisoryBody &&
                removedBody.membershipDetails === body.membershipDetails)) {
                removedBodies.push({
                    amlSupervisoryBody: SupervisoryBodyMapping[body.supervisoryBody as keyof typeof SupervisoryBodyMapping],
                    membershipId: body.membershipDetails
                });
            }
        });
        return removedBodies;
    }
}
