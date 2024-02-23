import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe("POST /limited/company-number", () => {
    it("should return status 200", async () => {
        await router.get("/register-acsp/limited/company-number").expect(200);
    });
});

describe("POST /limited/company-number", () => {
    it("should return status 400 after redirect", async () => {
        await router.post("/register-acsp/limited/company-number")
            .send({ companyNumber: " " }).expect(400);
    });
});

describe("POST /limited/company-number", () => {
    it("should return status 400 after redirect", async () => {
        await router.post("/register-acsp/limited/company-number")
            .send({ companyNumber: "@&£29864" }).expect(400);
    });
});

describe("POST /limited/company-number", () => {
    it("should return status 400 after redirect", async () => {
        await router.post("/register-acsp/limited/company-number")
            .send({ companyNumber: "@&£29864" }).expect(400);
    });
});

describe("POST /limited/company-number", () => {
    it("should return status 400 after redirect", async () => {
        await router.post("/register-acsp/limited/company-number")
            .send({ companyNumber: "NI5981260987654321" }).expect(400);
    });
});
