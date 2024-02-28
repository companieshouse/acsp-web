import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("Statement Relevant Officer Router", () => {
    it("should render statement-relevant-officer page", async () => {
        const response = await router.get("/register-acsp/sole-trader/statement-relevant-officer");
        expect(response.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("What is your role?");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await router.post("/register-acsp/sole-trader/statement-relevant-officer").send({
            WhatIsYourRole: "someone-else"
        });
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe("/register-acsp/sole-trader/stop-not-relevant-officer");
    });

    it("should respond with status 400 on form submission with invalid role", async () => {
        const response = await router.post("/register-acsp/sole-trader/statement-relevant-officer").send({
            WhatIsYourRole: "invalid-role"
        });
        expect(response.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Invalid role selection");
    });
});
