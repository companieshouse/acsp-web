import { Resource } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import { createPublicOAuthApiClient } from "../../../../src/services/apiService";
import {
    closeTransaction,
    postTransaction,
    getSavedApplication,
    putTransaction,
    getTransactionById
} from "../../../../src/services/transactions/transaction_service";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { StatusCodes } from "http-status-codes";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { REFERENCE } from "../../../../src/config";
import { validTransaction } from "../../../mocks/transaction_mock";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/apiService");

const mockCreatePublicOAuthApiClient = createPublicOAuthApiClient as jest.Mock;
const mockPostTransaction = jest.fn();
const mockPutTransaction = jest.fn();
const mockGetTransaction = jest.fn();
const mockGetSavedApplication = jest.fn();
const mockGetTransactionForResourceKind = jest.fn();

mockCreatePublicOAuthApiClient.mockReturnValue({
    transaction: {
        getTransaction: mockGetTransaction,
        postTransaction: mockPostTransaction,
        putTransaction: mockPutTransaction,
        getSavedApplication: mockGetSavedApplication,
        getTransactionsForResourceKind: mockGetTransactionForResourceKind
    }
});

let session: any;
const TRANSACTION_ID = "2222";
const OBJECT_ID = REFERENCE + "12345";
const EXPECTED_REF = REFERENCE;
const DESCRIPTION = "desc";
const USER_ID = "Y2VkZWVlMzhlZWFjY2M4MzQ3MT";

describe("transaction service tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
    });

    describe("postTransaction tests", () => {

        it("Should successfully post a transaction", async () => {
            mockPostTransaction.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.CREATED,
                resource: {
                    reference: REFERENCE,
                    description: "desc"
                }
            });
            const transaction: Transaction = await postTransaction(session, DESCRIPTION, REFERENCE);

            expect(transaction.reference).toEqual(REFERENCE);
            expect(transaction.description).toEqual(DESCRIPTION);
        });

        it("Should throw an error when no transaction api response", async () => {
            mockPostTransaction.mockResolvedValueOnce(undefined);

            await expect(postTransaction(session, DESCRIPTION, REFERENCE))
                .rejects.toBe(undefined);
        });

        it("Should throw an error when transaction api returns a status greater than 400", async () => {
            mockPostTransaction.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NOT_FOUND
            });

            await expect(postTransaction(session, DESCRIPTION, REFERENCE))
                .rejects.toEqual({ httpStatusCode: StatusCodes.NOT_FOUND });
        });

        it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
            mockPostTransaction.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(postTransaction(session, DESCRIPTION, REFERENCE))
                .rejects.toEqual({ httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE });
        });

        it("Should throw an error when transaction api returns no resource", async () => {
            mockPostTransaction.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.CREATED
            });

            await expect(postTransaction(session, DESCRIPTION, REFERENCE))
                .rejects.toEqual({ httpStatusCode: StatusCodes.CREATED });
        });
    });

    describe("putTransaction tests", () => {
        it("Should successfully PUT a transaction", async () => {
            mockPutTransaction.mockResolvedValueOnce({
                headers: {},
                httpStatusCode: StatusCodes.NO_CONTENT,
                resource: {
                    reference: EXPECTED_REF,
                    description: DESCRIPTION,
                    status: "closed"
                }
            } as ApiResponse<Transaction>);
            const transaction: ApiResponse<Transaction> = await putTransaction(session, TRANSACTION_ID, DESCRIPTION, REFERENCE, "closed");

            expect(transaction.resource?.reference).toEqual(EXPECTED_REF);
            expect(transaction.resource?.description).toEqual(DESCRIPTION);
            expect(transaction.resource?.status).toEqual("closed");

            expect(mockPutTransaction.mock.calls[0][0].status).toBe("closed");
            expect(mockPutTransaction.mock.calls[0][0].id).toBe(TRANSACTION_ID);
            expect(mockPutTransaction.mock.calls[0][0].reference).toBe(EXPECTED_REF);
        });

        it("Should throw an error when no transaction api response", async () => {
            mockPutTransaction.mockResolvedValueOnce(undefined);

            await expect(putTransaction(session, TRANSACTION_ID, DESCRIPTION, REFERENCE, "closed"))
                .rejects.toBe(undefined);
        });

        it("Should throw an error when transaction api returns a status greater than 400", async () => {
            mockPutTransaction.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NOT_FOUND
            });

            await expect(putTransaction(session, TRANSACTION_ID, DESCRIPTION, REFERENCE, "closed"))
                .rejects.toEqual({ httpStatusCode: StatusCodes.NOT_FOUND });
        });

        it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
            mockPutTransaction.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(putTransaction(session, TRANSACTION_ID, DESCRIPTION, REFERENCE, "closed"))
                .rejects.toEqual({ httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE });
        });
    });

    describe("closeTransaction tests", () => {
        it("Should extract payment url from headers", async () => {
            const paymentUrl = "http://payment";
            mockPutTransaction.mockResolvedValueOnce({
                headers: {
                    "x-payment-required": paymentUrl
                },
                httpStatusCode: 200,
                resource: {
                    reference: EXPECTED_REF,
                    description: "desc",
                    status: "closed"
                }
            } as ApiResponse<Transaction>);

            const url = await closeTransaction(session, TRANSACTION_ID, DESCRIPTION, REFERENCE);
            expect(url).toBe(paymentUrl);
        });

        it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
            mockPutTransaction.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(closeTransaction(session, TRANSACTION_ID, DESCRIPTION, REFERENCE))
                .rejects.toEqual({ httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE });
        });
    });

    describe("getSavedApplication tests", () => {
        it("Should return resolved responce for 200 status code", async () => {
            const mockSuccessResponce = {
                httpStatusCode: 200,
                resource: { items: [[Object]] }
            };
            mockGetTransactionForResourceKind.mockResolvedValueOnce(mockSuccessResponce);

            const httpResponse = await getSavedApplication(session, USER_ID);
            expect(httpResponse.httpStatusCode).toStrictEqual(200);
        });

        it("Should return resolved responce for 404 status code", async () => {
            const mockSuccessResponce = {
                httpStatusCode: 404,
                resource: { items: [[Object]] }
            };
            mockGetTransactionForResourceKind.mockResolvedValueOnce(mockSuccessResponce);

            const httpResponse = await getSavedApplication(session, USER_ID);
            expect(httpResponse.httpStatusCode).toStrictEqual(404);
        });

        it("Should throw an error when no transaction api response", async () => {
            mockGetTransactionForResourceKind.mockResolvedValueOnce(undefined);

            await expect(getSavedApplication(session, USER_ID)).rejects.toBe(undefined);
        });

        it("Should throw an error when status code is >=400 and not 404", async () => {
            const mockFailedResponce = {
                httpStatusCode: 500,
                resource: { items: [[Object]] }
            };
            mockGetTransactionForResourceKind.mockResolvedValueOnce(mockFailedResponce);

            await expect(getSavedApplication(session, USER_ID)).rejects.toBe(mockFailedResponce);
        });
        it("Should throw an error when no status code", async () => {
            const mockFailedResponce = {
                resource: { items: [[Object]] }
            };
            mockGetTransactionForResourceKind.mockResolvedValueOnce(mockFailedResponce);

            await expect(getSavedApplication(session, USER_ID)).rejects.toBe(mockFailedResponce);
        });
    });

    describe("getTransaction tests", () => {
        it("should return resolved transaction for 200 status code", async () => {
            const mockSuccessResponce = {
                httpStatusCode: 200,
                resource: validTransaction
            };
            mockGetTransaction.mockResolvedValueOnce(mockSuccessResponce);

            const transactionResp = await getTransactionById(session, TRANSACTION_ID);
            expect(transactionResp).toStrictEqual(validTransaction);
        });

        it("should throw an error when no transaction api response", async () => {
            mockGetTransaction.mockResolvedValueOnce(undefined);

            await expect(getTransactionById(session, TRANSACTION_ID)).rejects.toBe(undefined);
        });

        it("should throw an error when status code is >=400", async () => {
            const mockFailedResponce = {
                httpStatusCode: 500,
                resource: { items: [[Object]] }
            };
            mockGetTransaction.mockResolvedValueOnce(mockFailedResponce);

            await expect(getTransactionById(session, TRANSACTION_ID)).rejects.toBe(mockFailedResponce);
        });
        it("Should throw an error when no status code", async () => {
            const mockFailedResponce = {
                resource: { items: [[Object]] }
            };
            mockGetTransaction.mockResolvedValueOnce(mockFailedResponce);

            await expect(getTransactionById(session, TRANSACTION_ID)).rejects.toBe(mockFailedResponce);
        });
        it("Should throw an error when responce has no resource", async () => {
            const mockResponceNoResource = {
                httpStatusCode: 200
            };
            mockGetTransaction.mockResolvedValueOnce(mockResponceNoResource);

            await expect(getTransactionById(session, TRANSACTION_ID)).rejects.toBe(mockResponceNoResource);
        });
    });
});
