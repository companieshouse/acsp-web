import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, CHECK_SAVED_APPLICATION, START_URL } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET " + START_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.get(BASE_URL + START_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockCsrfProtectionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + CHECK_SAVED_APPLICATION + "?lang=en");
    });
});
