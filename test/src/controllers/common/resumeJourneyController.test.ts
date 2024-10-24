import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, TYPE_OF_BUSINESS } from "../../../../src/types/pageURL";
import { getTransactionById } from "../../../../src/services/transactions/transaction_service";
import { dummyPaymentResponse, PAYMENT_JOURNEY_URL } from "../../../mocks/payment_mock";
import { startPaymentsSession } from "../../../../src/services/paymentService";
import { mockClosedPendingPaymentTransaction, mockOpenTransaction } from "../../../mocks/transaction_mock";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/paymentService");
const router = supertest(app);

const mockGetTransaction = getTransactionById as jest.Mock;
const mockStartPaymentsSession = startPaymentsSession as jest.Mock;

describe("GET resume journey", () => {
    it("should return status 302 and redirect to type of business screen if transaction is open", async () => {
        mockGetTransaction.mockResolvedValueOnce(mockOpenTransaction);
        const res = await router.get(BASE_URL + "/resume?transactionId=119709-207817-181835&acspId=Y2VkZWVlMzhlZWFjY2M4MzQ3MT");
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });

    it("should return status 302 and redirect to payment if transaction is closed pending payment", async () => {
        mockGetTransaction.mockResolvedValueOnce(mockClosedPendingPaymentTransaction);
        mockStartPaymentsSession.mockResolvedValueOnce(dummyPaymentResponse);
        const res = await router.get(BASE_URL + "/resume?transactionId=119709-207817-181835&acspId=Y2VkZWVlMzhlZWFjY2M4MzQ3MT");
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(PAYMENT_JOURNEY_URL);
    });

    // Test for calling getTransaction failure.
    it("should return status 500 after calling getTransaction and failing", async () => {
        mockGetTransaction.mockRejectedValueOnce(new Error("Error getting transaction"));
        const res = await router.get(BASE_URL + "/resume?transactionId=119709-207817-181835&acspId=Y2VkZWVlMzhlZWFjY2M4MzQ3MT");
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    // Test for calling startPaymentsSession failure.
    it("should return status 500 after calling startPaymentsSession and failing", async () => {
        mockGetTransaction.mockResolvedValueOnce(mockClosedPendingPaymentTransaction);
        mockStartPaymentsSession.mockRejectedValueOnce(new Error("Error starting payment session"));
        const res = await router.get(BASE_URL + "/resume?transactionId=119709-207817-181835&acspId=Y2VkZWVlMzhlZWFjY2M4MzQ3MT");
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
