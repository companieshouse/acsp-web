import assert from "assert";
import supertest from "supertest";
import app from "../../../main/app";

describe("E2E Test", () => {
    it("should render stop-not-relevant-officer page", async () => {
        const response = await supertest(app).get("/register-as-companies-house-authorised-agent/sole-trader/stop-not-relevant-officer");
        assert(response.text.includes("Stop Not Relevant Officer"));
    });

});
