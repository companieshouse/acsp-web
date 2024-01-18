import supertest from "supertest";
import app from "../../../src/app";
const router = supertest(app);

describe("GET /sole-trader/name", () => {
    it("should return status 200", async () => {
        await router.get("/sole-trader/name").expect(200);
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST /sole-trader/name", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/sole-trader/name").send({ firstName: "John", middleName: "", lastName: "Doe" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST /sole-trader/name", () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post("/sole-trader/name").send({ firstName: "", middleName: "", lastName: "" }).expect(400);
    });
});
