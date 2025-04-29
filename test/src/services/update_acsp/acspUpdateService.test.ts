import { transactionId, validTransaction } from "../../../mocks/transaction_mock";
import { createRequest, MockRequest } from "node-mocks-http";
import { Request } from "express";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";
import { AcspUpdateService } from "../../../../src/services/update-acsp/acspUpdateService";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import { ACSP_DETAILS, UPDATE_SUBMISSION_ID } from "../../../../src/common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { postAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/acspRegistrationService");

const mockPostTransaction = postTransaction as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;
let req: MockRequest<Request>;
const acspUpdateService = new AcspUpdateService();

describe("AcspUpdateService tests", () => {

    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    describe("createTransaction tests", () => {
        it("should return start a new transaction and save the transaction ID to session", async () => {
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            const session: Session = req.session as any as Session;

            session.setExtraData(ACSP_DETAILS, dummyFullProfile);

            await acspUpdateService.createTransaction(session);

            expect(session.getExtraData(UPDATE_SUBMISSION_ID)).toEqual(transactionId);
        });

        it("should not start a new transaction if one already exists", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(UPDATE_SUBMISSION_ID, transactionId);
            await acspUpdateService.createTransaction(session);

            expect(mockPostTransaction).not.toHaveBeenCalled();
        });

        it("should throw an error if postTransaction fails", () => {
            mockPostTransaction.mockRejectedValueOnce(new Error("Failed to post transaction"));
            const session: Session = req.session as any as Session;

            expect(acspUpdateService.createTransaction(session)).rejects.toThrow();
        });
    });

    describe("saveUpdatedDetails tests", () => {
        let session: Session;
        let acspDetails: AcspFullProfile;
        let acspDetailsUpdated: AcspFullProfile;

        beforeEach(() => {
            session = req.session as any as Session;
            acspDetails = {
                number: "AP123456",
                status: "",
                type: "",
                notifiedFrom: new Date(),
                registeredOfficeAddress: { addressLine1: "Old Address" },
                serviceAddress: { addressLine1: "Old Service Address" },
                email: "old@example.com",
                name: "Old Name",
                soleTraderDetails: {
                    usualResidentialCountry: "Old Country",
                    forename: "Old Forename",
                    otherForenames: "Old Other Forenames",
                    surname: "Old Surname"
                },
                amlDetails: [{ supervisoryBody: "association-of-chartered-certified-accountants-acca", membershipDetails: "123456" }]
            } as AcspFullProfile;

            acspDetailsUpdated = {
                number: "AP123456",
                status: "",
                type: "",
                notifiedFrom: new Date(),
                registeredOfficeAddress: { addressLine1: "New Address" },
                serviceAddress: { addressLine1: "New Service Address" },
                email: "new@example.com",
                name: "New Name",
                soleTraderDetails: {
                    usualResidentialCountry: "New Country",
                    forename: "New Forename",
                    otherForenames: "New Other Forenames",
                    surname: "New Surname"
                },
                amlDetails: [{ supervisoryBody: "association-of-chartered-certified-accountants-acca", membershipDetails: "123456" }]
            } as AcspFullProfile;
        });

        it("should save updated details and call postAcspRegistration", async () => {
            session.setExtraData(UPDATE_SUBMISSION_ID, transactionId);

            await acspUpdateService.saveUpdatedDetails(session, acspDetails, acspDetailsUpdated);

            const expectedAcspData: AcspData = {
                acspType: "UPDATE_ACSP",
                acspId: acspDetails.number,
                applicantDetails: {
                    correspondenceAddress: acspDetailsUpdated.serviceAddress,
                    correspondenceEmail: acspDetailsUpdated.email,
                    countryOfResidence: acspDetailsUpdated.soleTraderDetails?.usualResidentialCountry,
                    firstName: acspDetailsUpdated.soleTraderDetails?.forename,
                    middleName: acspDetailsUpdated.soleTraderDetails?.otherForenames,
                    lastName: acspDetailsUpdated.soleTraderDetails?.surname
                },
                registeredOfficeAddress: acspDetailsUpdated.registeredOfficeAddress,
                businessName: acspDetailsUpdated.name
            };

            expect(mockPostAcspRegistration).toHaveBeenCalledWith(session, transactionId, expectedAcspData);
        });

        it("should save updated details and call postAcspRegistration with undefined soleTraderDetails", async () => {
            session.setExtraData(UPDATE_SUBMISSION_ID, transactionId);

            acspDetails.soleTraderDetails = undefined;
            acspDetailsUpdated.soleTraderDetails = undefined;

            await acspUpdateService.saveUpdatedDetails(session, acspDetails, acspDetailsUpdated);

            const expectedAcspData: AcspData = {
                acspType: "UPDATE_ACSP",
                acspId: "AP123456",
                applicantDetails: {
                    correspondenceAddress: acspDetailsUpdated.serviceAddress,
                    correspondenceEmail: acspDetailsUpdated.email
                },
                registeredOfficeAddress: acspDetailsUpdated.registeredOfficeAddress,
                businessName: acspDetailsUpdated.name
            };
            expect(mockPostAcspRegistration).toHaveBeenCalledWith(session, transactionId, expectedAcspData);
        });

        it("should save updated AML bodies and call postAcspRegistration", async () => {
            session.setExtraData(UPDATE_SUBMISSION_ID, transactionId);

            acspDetailsUpdated = { ...acspDetails, amlDetails: [{ supervisoryBody: "institute-of-chartered-accountants-in-england-and-wales-icaew", membershipDetails: "654321" }] };

            await acspUpdateService.saveUpdatedDetails(session, acspDetails, acspDetailsUpdated);

            const expectedAcspData: AcspData = {
                acspType: "UPDATE_ACSP",
                acspId: "AP123456",
                applicantDetails: {},
                amlSupervisoryBodies: [{ amlSupervisoryBody: "ICAEW", membershipId: "654321" }],
                removedAmlSupervisoryBodies: [{ amlSupervisoryBody: "ACCA", membershipId: "123456" }]
            };
            expect(mockPostAcspRegistration).toHaveBeenCalledWith(session, transactionId, expectedAcspData);
        });

        it("should handle errors and reject the promise", async () => {
            session.setExtraData(UPDATE_SUBMISSION_ID, transactionId);
            mockPostAcspRegistration.mockRejectedValueOnce(new Error("Failed to post registration"));
            await expect(acspUpdateService.saveUpdatedDetails(session, acspDetails, acspDetailsUpdated)).rejects.toThrow("Failed to post registration");
        });
    });
});
