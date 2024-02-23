import request from "supertest";
import app from "../../../main/app";
import { BASE_URL, LIMITED_COMPANY_NUMBER } from "../../../main/types/pageURL";

describe("CompanyLookupController", () => {
    test("GET" + LIMITED_COMPANY_NUMBER, async () => {
        const res = await request(app).get("/register-acsp/limited/company-number");
        expect(res.status).toBe(200);// render company number page

    });

    test("POST" + LIMITED_COMPANY_NUMBER, async () => {
        const res = await request(app).post("/register-acsp/limited/company-number").send({ companyNumber: "NI038379" });
        expect(res.status).toBe(302); // Redirect status code - valid company number

    });

    test("POST" + LIMITED_COMPANY_NUMBER, async () => {
        const res = await request(app).post("/register-acsp/limited/company-number").send({ companyNumber: "" });
        expect(res.status).toBe(400); // Bad request status code -invalid company number

    });

    test("POST" + LIMITED_COMPANY_NUMBER, async () => {
        const res = await request(app).post("/register-acsp/limited/company-number").send({ companyNumber: "12345678" });
        expect(res.status).toBe(400); // Bad request status code -invalid company number

    });
});
