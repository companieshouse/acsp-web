import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { SIGN_OUT_URL, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SIGN_OUT_URL, () => {
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + SIGN_OUT_URL);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test will return 302 after redirecting to the next page.
describe("POST" + SIGN_OUT_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + SIGN_OUT_URL);
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
