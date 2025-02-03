import { transactionId, validTransaction } from "../../mocks/transaction_mock";
import { createRequest, MockRequest } from "node-mocks-http";
import { Request } from "express";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";
import { AcspUpdateService } from "../../../src/services/acspUpdateService";
import { postTransaction } from "../../../src/services/transactions/transaction_service";
import { UPDATE_SUBMISSION_ID } from "../../../src/common/__utils/constants";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/transactions/transaction_service");

const mockPostTransaction = postTransaction as jest.Mock;
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

    it("should return start a new transaction and save the transaction ID to session", async () => {
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        const session: Session = req.session as any as Session;
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
