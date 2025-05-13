/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_CLOSE_ACSP = "true";

import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, CLOSE_WHAT_WILL_HAPPEN } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";

const router = supertest(app);

describe("GET " + CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN, () => {
    it("should return status 200 and render the page", async () => {
        const res = await router.get(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("What will happen when you close the authorised agent account");
        expect(res.status).toBe(200);
    });

    it("should return status 500 if an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test Error");
        });
        const res = await router.get(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN)
            .send({ whatWillHappenConfirm: "confirm" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE + "?lang=en");
    });

    it("should return status 400 if the checkbox is not selected", async () => {
        const res = await router.post(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN)
            .send({ whatWillHappenConfirm: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select to confirm you have read and understood the statement");
    });

    it("should return status 500 when an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(CLOSE_ACSP_BASE_URL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
