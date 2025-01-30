/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, ACSP_DETAILS_UPDATE_CONFIRMATION } from "../../../../src/types/pageURL";
const router = supertest(app);

describe("GET " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + ACSP_DETAILS_UPDATE_CONFIRMATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
