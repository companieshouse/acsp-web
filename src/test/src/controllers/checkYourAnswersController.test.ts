import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { BASE_URL, CHECK_YOUR_ANSWERS, PAYMENT_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + CHECK_YOUR_ANSWERS, () => {
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Check your answers before sending your application");
    });
});

describe("POST" + CHECK_YOUR_ANSWERS, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + CHECK_YOUR_ANSWERS);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + PAYMENT_URL + "?lang=en");
    });
});
