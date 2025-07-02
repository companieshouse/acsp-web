import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, PAYMENT_FAILED } from "../../../../src/types/pageURL";

const router = supertest(app);

describe("GET" + PAYMENT_FAILED, () => {

    it("should return status 200 and render the payment failed page", async () => {
        const response = await router.get(BASE_URL + PAYMENT_FAILED);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.text).toContain("Payment Failed");
    });
});
