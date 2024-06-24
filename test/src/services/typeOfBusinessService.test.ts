import { postTransaction } from "../../../src/services/transactions/transaction_service";
import { validTransaction } from "../../mocks/transaction_mock";
import { TypeOfBusinessService } from "../../../src/services/typeOfBusinessService";
import { createRequest, createResponse, MockRequest, MockResponse } from "node-mocks-http";
import { Request, Response } from "express";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/transactions/transaction_service");

const mockPostTransaction = postTransaction as jest.Mock;
let req: MockRequest<Request>;
let res: MockResponse<Response>;
describe("typeOfBusinessService tests", () => {

    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        res = createResponse();
    });
    it("should return transaction ID", () => {
        mockPostTransaction.mockResolvedValueOnce(validTransaction);
        const typeOfBusinessService = new TypeOfBusinessService();
        const transactionId = typeOfBusinessService.createTransaction(req, res);
        expect(transactionId).toEqual(transactionId);
    });

    it("should throw an error if postTransaction fails", () => {
        mockPostTransaction.mockRejectedValueOnce(new Error("Failed to post transaction"));
        const typeOfBusinessService = new TypeOfBusinessService();
        expect(typeOfBusinessService.createTransaction(req, res)).rejects.toThrow();
    });
});
