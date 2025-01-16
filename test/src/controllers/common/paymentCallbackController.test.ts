import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, CONFIRMATION, PAYMENT_CALLBACK_URL, PAYMENT_FAILED } from "../../../../src/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Payment callback controller tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should redirect to confirmation page for successful payment", async () => {
        const response = await router.get(BASE_URL + PAYMENT_CALLBACK_URL +
            "?ref=Register_ACSP&state=123456&status=paid");

        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + CONFIRMATION + "?lang=en");
    });

    it("should redirect to payment failed page for declined payment", async () => {
        const response = await router.get(BASE_URL + PAYMENT_CALLBACK_URL +
            "?ref=CS_REFERENCE&state=123456&status=failed");

        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + PAYMENT_FAILED + "?lang=en");
    });

    it("should redirect to payment page for cancelled payment", async () => {
        const response = await router.get(BASE_URL + PAYMENT_CALLBACK_URL +
            "?ref=CS_REFERENCE&state=123456&status=cancelled");

        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + PAYMENT_FAILED + "?lang=en");
    });

    // it("should error if state doesn't match session state", async () => {
    //     const response = await router.get(BASE_URL + PAYMENT_CALLBACK_URL +
    //         "?ref=Register_ACSP&state=56789&status=paid");

    //     expect(response.status).toBe(500);
    //     expect(response.text).toContain("Sorry we are experiencing technical difficulties");
    // });
});
