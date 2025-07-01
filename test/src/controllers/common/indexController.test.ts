import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, HOME_URL, CHECK_SAVED_APPLICATION } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET " + HOME_URL, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return status 200", async () => {
        await router.get(BASE_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(0);
        expect(200);
    });
});

describe("POST " + HOME_URL, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + CHECK_SAVED_APPLICATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(0);
    });
});
