import supertest from "supertest";
import request from "supertest";
import app from "../../../main/app";
const router = supertest(app);
import { BASE_URL, LIMITED_COMPANY_NUMBER } from "../../../main/types/pageURL";

describe("CompanyLookupController", () => {
    test("GET" + LIMITED_COMPANY_NUMBER, async () => {
        const res = await request(app).get(BASE_URL + LIMITED_COMPANY_NUMBER);
        expect(res.status).toBe(200);// render company number page

    });
    });

describe("POST" + LIMITED_COMPANY_NUMBER, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_COMPANY_NUMBER).expect(200);
    });
});

describe("POST" + LIMITED_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_COMPANY_NUMBER)
            .send({ companyNumber: " " }).expect(400);
    });
});

describe("POST" + LIMITED_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_COMPANY_NUMBER)
            .send({ companyNumber: "@&£29864" }).expect(400);
    });
});

describe("POST" + LIMITED_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_COMPANY_NUMBER)
            .send({ companyNumber: "@&£29864" }).expect(400);
    });
});

describe("POST" + LIMITED_COMPANY_NUMBER, () => {
    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_COMPANY_NUMBER)
            .send({ companyNumber: "NI5981260987654321" }).expect(400);
    });
});

test("POST" + LIMITED_COMPANY_NUMBER, async () => {
    const res = await request(app)
        .post(BASE_URL + LIMITED_COMPANY_NUMBER)
        .send({ companyNumber: "NI038379" });

    expect(res.status).toBe(302); });// Redirect status code - valid company number
