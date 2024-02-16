import assert from "assert";
import supertest from "supertest";
import app from "../../../main/app";

const router = supertest(app);

describe("Stop Not Relevant Officer Router", () => {
    it("should respond with status 200", async () => {
        const response = await supertest(app).get("/register-acsp/sole-trader/stop-not-relevant-officer");
        assert.strictEqual(response.status, 200);
    });

    it("should respond with text/html", async () => {
        const response = await supertest(app).get("/register-acsp/sole-trader/stop-not-relevant-officer");
        assert.strictEqual(response.header["content-type"], "text/html; charset=utf-8");
    });
});
