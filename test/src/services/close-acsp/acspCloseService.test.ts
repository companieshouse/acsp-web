import { transactionId, validTransaction } from "../../../mocks/transaction_mock";
import { createRequest, MockRequest } from "node-mocks-http";
import { Request } from "express";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";
import { AcspCloseService } from "../../../../src/services/close-acsp/acspCloseService";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import { ACSP_DETAILS, CLOSE_SUBMISSION_ID } from "../../../../src/common/__utils/constants";
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
const acspCloseService = new AcspCloseService();

describe("AcspCloseService tests", () => {

    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    describe("createTransaction tests", () => {
        afterEach(() => {
            process.removeAllListeners("uncaughtException");
        });
        it("should return start a new transaction and save the transaction ID to session", async () => {
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            const session: Session = req.session as any as Session;
            session.setExtraData(ACSP_DETAILS, dummyFullProfile);

            await acspCloseService.createTransaction(session);

            expect(session.getExtraData(CLOSE_SUBMISSION_ID)).toEqual(transactionId);
        });

        it("should not start a new transaction if one already exists", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(CLOSE_SUBMISSION_ID, transactionId);
            await acspCloseService.createTransaction(session);

            expect(mockPostTransaction).not.toHaveBeenCalled();
        });

        it("should throw an error if postTransaction fails", () => {
            mockPostTransaction.mockRejectedValueOnce(new Error("Failed to post transaction"));
            const session: Session = req.session as any as Session;

            expect(acspCloseService.createTransaction(session)).rejects.toThrow();
        });
    });

    describe("saveCloseDetails tests", () => {
        let session: Session;
        let acspDetails: AcspFullProfile;

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
                amlDetails: [{ supervisoryBody: "association-of-chartered-certified-accountants-acca", membershipDetails: "123456" }]
            } as AcspFullProfile;
        });
        afterEach(() => {
            process.removeAllListeners("uncaughtException");
        });
        it("should save the ACSP & acsp type then call postAcspRegistration", async () => {
            session.setExtraData(CLOSE_SUBMISSION_ID, transactionId);

            await acspCloseService.saveCloseDetails(session, acspDetails);

            const expectedAcspData: AcspData = {
                acspType: "CLOSE_ACSP",
                acspId: acspDetails.number
            };

            expect(mockPostAcspRegistration).toHaveBeenCalledWith(session, transactionId, expectedAcspData);
        });

        it("should handle errors and reject the promise", async () => {
            session.setExtraData(CLOSE_SUBMISSION_ID, transactionId);
            mockPostAcspRegistration.mockRejectedValueOnce(new Error("Failed to post registration"));
            await expect(acspCloseService.saveCloseDetails(session, acspDetails)).rejects.toThrow("Failed to post registration");
        });
    });
});
