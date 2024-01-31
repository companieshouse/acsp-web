import supertest from "supertest";
import app from "../../../main/app";

const request = supertest(app);

describe("Statement Relevant Officer Router", () => {
    it("should render statement-relevant-officer page", async () => {
        const response = await request.get("/sole-trader/statement-relevant-officer");
        expect(response.status).toBe(200);
        expect(response.text).toContain("What is your role?");
    });

    it("should respond with status 400 on form submission with invalid role", async () => {
        const response = await request.post("/sole-trader/statement-relevant-officer").send({
            WhatIsYourRole: "invalid-role"
        });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Invalid role selection");
    });
});
