import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { dummyPayment, PAYMENT_JOURNEY_URL } from "../../mocks/payment_mock";
import { BASE_URL, CHECK_YOUR_ANSWERS, CONFIRMATION } from "../../../main/types/pageURL";
import { closeTransaction } from "../../../main/services/transactions/transaction_service";
import { startPaymentsSession } from "../../../main/services/paymentService";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { getAcspRegistration } from "../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/transactions/transaction_service");
jest.mock("../../../main/services/paymentService");
jest.mock("../../../main/services/acspRegistrationService");
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

describe("GET" + CHECK_YOUR_ANSWERS, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Check your answers before sending your application");
    });
});

describe("POST" + CHECK_YOUR_ANSWERS, () => {

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

});
