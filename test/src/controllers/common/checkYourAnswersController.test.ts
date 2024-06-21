import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { dummyPayment, PAYMENT_JOURNEY_URL } from "../../../mocks/payment_mock";
import { BASE_URL, CHECK_YOUR_ANSWERS, CONFIRMATION } from "../../../../src/types/pageURL";
import { closeTransaction } from "../../../../src/services/transactions/transaction_service";
import { startPaymentsSession } from "../../../../src/services/paymentService";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { getAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/paymentService");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockCloseTransaction = closeTransaction as jest.Mock;
const mockStartPaymentsSession = startPaymentsSession as jest.Mock;
const mockGetAcspRegistration = getAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED"
};

const dummyHeaders = {
    header1: "45435435"
};

const dummyPaymentResponse: ApiResponse<Payment> = {
    headers: dummyHeaders,
    httpStatusCode: 200,
    resource: dummyPayment
};
const dummyPaymentResponseNoResource: ApiResponse<Payment> = {
    headers: dummyHeaders,
    httpStatusCode: 200
};

describe("GET" + CHECK_YOUR_ANSWERS, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Check your answers before sending your application");
    });

    it("should return status 500 after calling getAcspRegistration endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mockGetAcspRegistration).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + CHECK_YOUR_ANSWERS, () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return status 302 after redirect to confirmation page", async () => {
        mockCloseTransaction.mockResolvedValueOnce(undefined);
        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);

        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + CONFIRMATION + "?lang=en");
    });

    it("should return status 302 after redirect to the payment journey url", async () => {
        mockCloseTransaction.mockResolvedValueOnce("/payment/1234");
        mockStartPaymentsSession.mockResolvedValueOnce(dummyPaymentResponse);

        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);

        expect(res.status).toBe(302);
        expect(res.header.location).toBe(PAYMENT_JOURNEY_URL);
    });

    it("should return status 500 after calling closeTransaction endpoint and failing", async () => {
        mockCloseTransaction.mockRejectedValueOnce(new Error("Error closing transaction"));
        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mockCloseTransaction).toHaveBeenCalledTimes(1);
        expect(mockStartPaymentsSession).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should return status 500 after calling closeTransaction endpoint and failing", async () => {
        mockCloseTransaction.mockResolvedValueOnce("/payment/1234");
        mockStartPaymentsSession.mockRejectedValueOnce(new Error("Error starting payment session"));
        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mockCloseTransaction).toHaveBeenCalledTimes(1);
        expect(mockStartPaymentsSession).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should return status 500 after calling startPaymentSession endpoint and getting no resource", async () => {
        mockCloseTransaction.mockResolvedValueOnce("/payment/1234");
        mockStartPaymentsSession.mockResolvedValueOnce(dummyPaymentResponseNoResource);
        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mockCloseTransaction).toHaveBeenCalledTimes(1);
        expect(mockStartPaymentsSession).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

});
