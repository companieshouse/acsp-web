import { Session } from "@companieshouse/node-session-handler";
import { createAndLogError } from "../../../src/utils/logger";
import { createPaymentApiClient } from "../../../src/services/apiService";
import { startPaymentsSession } from "../../../src/services/paymentService";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { CreatePaymentRequest, Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { API_URL } from "../../../src/utils/properties";
import { dummyPayment } from "../../mocks/payment_mock";
import { BASE_URL, PAYMENT_CALLBACK_URL } from "../../../src/types/pageURL";
import { PAYEMNT_REFERENCE } from "../../../src/common/__utils/constants";

jest.mock("../../../src/utils/logger");
jest.mock("../../../src/services/apiService");

const TRANSACTION_ID = "987654321";
const PAYMENT_SESSION_URL = "/payment/21321";
const PAYMENT_RESOURCE_URI = "/transactions/" + TRANSACTION_ID + "/payment";
const UUID = `nonce-${TRANSACTION_ID}`;
const REFERENCE = PAYEMNT_REFERENCE + TRANSACTION_ID;
const mockCreatePaymentWithFullUrl = jest.fn();
const mockCreatePaymentApiClient = createPaymentApiClient as jest.Mock;
mockCreatePaymentApiClient.mockReturnValue({
    payment: {
        createPaymentWithFullUrl: mockCreatePaymentWithFullUrl
    }
});

const mockIsFailure = jest.fn();
mockIsFailure.mockReturnValue(false);

const mockIsSuccess = jest.fn();
mockIsSuccess.mockReturnValue(true);

const mockCreateAndLogError = createAndLogError as jest.Mock;
const ERROR: Error = new Error("oops");
mockCreateAndLogError.mockReturnValue(ERROR);

const dummyHeaders = {
    header1: "45435435"
};

const dummyErrors = {
    error1: "something"
};

const dummyApiResponse = {
    errors: dummyErrors,
    headers: dummyHeaders,
    httpStatusCode: 200,
    resource: dummyPayment
} as ApiResponse<Payment>;

const dummyPaymentResult = {
    value: dummyApiResponse,
    isSuccess: mockIsSuccess,
    isFailure: mockIsFailure
};

let session: any;

describe("Payment Service tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
    });

    describe("startPaymentsSession tests", () => {

        it("Should return a successful response", async () => {
            dummyApiResponse.httpStatusCode = 200;
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(dummyPaymentResult);
            const apiResponse: ApiResponse<Payment> = await startPaymentsSession(session,
                PAYMENT_SESSION_URL, TRANSACTION_ID, "nonce");

            expect(apiResponse.httpStatusCode).toBe(200);
            expect(apiResponse.resource).toBe(dummyPayment);
            expect(apiResponse.headers).toBe(dummyHeaders);

            expect(mockCreatePaymentApiClient).toHaveBeenCalledWith(session, PAYMENT_SESSION_URL);

            const paymentRequest: CreatePaymentRequest = mockCreatePaymentWithFullUrl.mock.calls[0][0];
            expect(paymentRequest.redirectUri).toBe("http://chs.local" + BASE_URL + PAYMENT_CALLBACK_URL);
            expect(paymentRequest.reference).toBe(REFERENCE);
            expect(paymentRequest.resource).toBe(API_URL + PAYMENT_RESOURCE_URI);
            expect(paymentRequest.state).toBe(UUID);
        });

        it("Should throw error on payment failure 401 response", async () => {
            dummyApiResponse.httpStatusCode = 401;
            mockIsFailure.mockReturnValueOnce(true);
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(dummyPaymentResult);

            await expect(startPaymentsSession(session,
                PAYMENT_SESSION_URL, TRANSACTION_ID, "nonce"))
                .rejects
                .toThrow(ERROR);

            expect(mockCreateAndLogError).toHaveBeenCalledWith("payment.service Http status code 401 - Failed to create payment,  {\"error1\":\"something\"}");
        });

        it("Should throw error on payment failure 429 response", async () => {
            dummyApiResponse.httpStatusCode = 429;
            mockIsFailure.mockReturnValueOnce(true);
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(dummyPaymentResult);

            await expect(startPaymentsSession(session,
                PAYMENT_SESSION_URL, TRANSACTION_ID, "nonce"))
                .rejects
                .toThrow(ERROR);

            expect(mockCreateAndLogError).toHaveBeenCalledWith("payment.service Http status code 429 - Failed to create payment,  {\"error1\":\"something\"}");
        });

        it("Should throw error on payment failure with unknown http response", async () => {
            dummyApiResponse.httpStatusCode = 500;
            mockIsFailure.mockReturnValueOnce(true);
            mockCreatePaymentWithFullUrl.mockResolvedValueOnce(dummyPaymentResult);

            await expect(startPaymentsSession(session,
                PAYMENT_SESSION_URL, TRANSACTION_ID, "nonce"))
                .rejects
                .toThrow(ERROR);

            expect(mockCreateAndLogError).toHaveBeenCalledWith("payment.service Unknown Error {\"error1\":\"something\"}");
        });
    });
});
