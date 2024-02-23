import supertest from "supertest";
import app from "../../../main/app";

const request = supertest(app);

describe("Statement Relevant Officer Router", () => {
    it("should render statement-relevant-officer page", async () => {
        const response = await request.get("/register-acsp/sole-trader/statement-relevant-officer");
        expect(response.status).toBe(200);
        expect(response.text).toContain("What is your role?");
    });

    it("should respond with status 302 on form submission with someone-else role", async () => {
        const response = await request.post("/register-acsp/sole-trader/statement-relevant-officer").send({
            WhatIsYourRole: "someone-else"
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe("/register-acsp/sole-trader/stop-not-relevant-officer");
    });

    it("should respond with status 400 on form submission with invalid role", async () => {
        const response = await request.post("/register-acsp/sole-trader/statement-relevant-officer").send({
            WhatIsYourRole: "invalid-role"
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Invalid role selection");
    });
});
