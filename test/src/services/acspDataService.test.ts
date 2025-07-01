import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AcspDataService } from "../../../src/services/acspDataService";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { createRequest, MockRequest } from "node-mocks-http";
import { APPLICATION_ID, RESUME_APPLICATION_ID, SUBMISSION_ID, USER_DATA } from "../../../src/common/__utils/constants";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { deleteAcspApplication, postAcspRegistration, putAcspRegistration } from "../../../src/services/acspRegistrationService";
import { postTransaction } from "../../../src/services/transactions/transaction_service";
import { validTransaction, transactionId } from "../../mocks/transaction_mock";
import { HttpResponse } from "@companieshouse/api-sdk-node/dist/http";

jest.mock("../../../src/services/acspRegistrationService");
jest.mock("../../../src/services/transactions/transaction_service");

const service = new AcspDataService();

const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockPostAcspRegistration = postAcspRegistration as jest.Mock;
const mockDeleteAcspApplication = deleteAcspApplication as jest.Mock;
const mockPostTransaction = postTransaction as jest.Mock;

const mockAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "SOLE_TRADER",
    acspType: "register-acsp",
    applicantDetails: {
        firstName: "Test",
        lastName: "User"
    }
};

const mockPostResponce = {
    id: "12345"
};

const mockDeleteResponce: HttpResponse = {
    status: 204
};

describe("AcspDataService tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        jest.clearAllMocks();
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    describe("saveAcspData tests", () => {
        afterEach(() => {
            process.removeAllListeners("uncaughtException");
        });
        it("should call POST registration if acspData is undefined", async () => {
            const session: Session = req.session as any as Session;
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            mockPostAcspRegistration.mockResolvedValueOnce(mockPostResponce);
            await service.saveAcspData(session, undefined!, "SOLE_TRADER");
            await service.saveAcspData(session, mockAcspData, "register-acsp");
            expect(postAcspRegistration).toHaveBeenCalled();
            expect(session.getExtraData(APPLICATION_ID)).toBe("12345");
        });

        it("should call PUT registration if acspData is not undefined", async () => {
            const session: Session = req.session as any as Session;
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            mockPutAcspRegistration.mockResolvedValue({});
            await service.saveAcspData(session, mockAcspData, "SOLE_TRADER");
            await service.saveAcspData(session, mockAcspData, "register-acsp");
            expect(putAcspRegistration).toHaveBeenCalled();
        });

        it("should call PUT registration if acspData is not undefined", async () => {
            const session: Session = req.session as any as Session;
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            mockPutAcspRegistration.mockResolvedValue({});
            await service.saveAcspData(session, mockAcspData);
            expect(putAcspRegistration).toHaveBeenCalled();
            expect(session.getExtraData(SUBMISSION_ID)).toBe(transactionId);
        });

        it("should create a new transaction if SUBMISSION_ID is null", async () => {
            const session: Session = req.session as any as Session;
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            await service.saveAcspData(session, mockAcspData);
            expect(postTransaction).toHaveBeenCalled();
        });

        it("should not create a new transaction if SUBMISSION_ID is != null", async () => {
            const session: Session = req.session as any as Session;
            session.setExtraData(SUBMISSION_ID, "transactionID");
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            await service.saveAcspData(session, mockAcspData);
            expect(postTransaction).toHaveBeenCalledTimes(0);
        });

    });

    describe("createNewApplication tests", () => {
        afterEach(() => {
            process.removeAllListeners("uncaughtException");
        });
        it("should delete the old application and create a new one", async () => {
            // given
            const session: Session = req.session as any as Session;
            mockDeleteAcspApplication.mockResolvedValueOnce(mockDeleteResponce);
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            mockPostAcspRegistration.mockResolvedValueOnce(mockPostResponce);
            // when
            await service.createNewApplication(session, "SOLE_TRADER");
            // then
            expect(mockDeleteAcspApplication).toHaveBeenCalled();
            expect(mockPostTransaction).toHaveBeenCalled();
            expect(mockPostAcspRegistration).toHaveBeenCalled();
        });

        it("should clear the session data when creating a new application and set SUBMISSION_ID to the new transaction id", async () => {
            // given
            const session: Session = req.session as any as Session;
            mockDeleteAcspApplication.mockResolvedValueOnce(mockDeleteResponce);
            mockPostTransaction.mockResolvedValueOnce(validTransaction);
            mockPostAcspRegistration.mockResolvedValueOnce(mockPostResponce);
            // when
            await service.createNewApplication(session, "SOLE_TRADER");
            // then
            expect(session.getExtraData(USER_DATA)).toBe(undefined);
            expect(session.getExtraData(RESUME_APPLICATION_ID)).toBe(undefined);

        });
        it("should return a promise reject if an error occurs", async () => {
            // given
            const session: Session = req.session as any as Session;
            mockDeleteAcspApplication.mockRejectedValueOnce(new Error("Error deleting application"));
            // then
            expect(service.createNewApplication(session, "SOLE_TRADER")).rejects.toEqual(Error("Error deleting application"));
        });
    });
});
