import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, HOME_URL, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET " + HOME_URL, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(200);
    });
});

describe("POST " + HOME_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
