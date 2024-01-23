import supertest from "supertest";
import app from "../../../src/app";
const router = supertest(app);

describe("GET /sole-trader/address-correspondance-manual", () => {
    it("should return status 200", async () => {
        await router.get("/sole-trader/address-correspondance-manual").expect(200);
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST /sole-trader/address-correspondance-manual", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/sole-trader/address-correspondance-manual").send({ addressPropertyDetails: "abc", addressLine1: "pqr", addressLine2: "pqr", addressTown: "lmn", addressCounty: "lmn", addressCountry: "lmn", addressPostcode: "MK9 3GB" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST /sole-trader/address-correspondance-manual", () => {
    it("should return status 400", async () => {
        await router.post("/sole-trader/address-correspondance-manual").send({ addressPropertyDetails: "abc", addressPostcode: "MK913GB" }).expect(400);
    });
});
