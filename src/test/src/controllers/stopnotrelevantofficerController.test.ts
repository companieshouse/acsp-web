import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import assert from "assert";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Stop Not Relevant Officer Router", () => {
    it("should respond with status 200", async () => {
        const response = await supertest(app).get("/register-acsp/sole-trader/stop-not-relevant-officer");
        assert.strictEqual(response.status, 200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should respond with text/html", async () => {
        const response = await supertest(app).get("/register-acsp/sole-trader/stop-not-relevant-officer");
        assert.strictEqual(response.header["content-type"], "text/html; charset=utf-8");
    });
});
