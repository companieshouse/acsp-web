import { postTransaction } from "../../../src/services/transactions/transaction_service";
import { validTransaction } from "../../mocks/transaction_mock";
import { TypeOfBusinessService } from "../../../src/services/typeOfBusinessService";
import { createRequest, createResponse, MockRequest, MockResponse } from "node-mocks-http";
import { Request, Response } from "express";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/transactions/transaction_service");

const mockPostTransaction = postTransaction as jest.Mock;
let req: MockRequest<Request>;
describe("typeOfBusinessService tests", () => {

    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });
    it("should return transaction ID", () => {
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        const session: Session = req.session as any as Session;
        const typeOfBusinessService = new TypeOfBusinessService();
        const transactionId = typeOfBusinessService.createTransaction(session);
        expect(transactionId).toEqual(transactionId);
    });

    it("should throw an error if postTransaction fails", () => {
        mockPostTransaction.mockRejectedValueOnce(new Error("Failed to post transaction"));
        const session: Session = req.session as any as Session;
        const typeOfBusinessService = new TypeOfBusinessService();
        expect(typeOfBusinessService.createTransaction(session)).rejects.toThrow();
    });
});
