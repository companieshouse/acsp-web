/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_CLOSE_ACSP = "true";

import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, CLOSE_CONFIRMATION_ACSP_CLOSED } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";
import * as controller from "../../../../src/controllers/features/close-acsp/confirmYouWantToCloseController";

const router = supertest(app);
let req: any;
let res: any;
let next: jest.Mock;

beforeEach(() => {
    req = { query: {}, session: { getExtraData: jest.fn() } };
    res = { render: jest.fn() };
    next = jest.fn();
});

describe("GET " + CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, () => {
    it("should return status 200 and render the page", async () => {
        const res = await router.get(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("Confirm you want to close the authorised agent account");
        expect(res.status).toBe(200);
    });

    it("should return status 500 if an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.get(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should call next with error if an exception is caught", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Unit test error");
        });
        await controller.get(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});

describe("POST " + CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRMATION_ACSP_CLOSED + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(CLOSE_ACSP_BASE_URL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should call next with error if an exception is caught", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("test error");
        });
        await controller.post(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
