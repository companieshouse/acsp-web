import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe("GET /sole-trader/correspondence-address-list", () => {
    it("should return status 200", async () => {
        await router.get("/register-acsp/sole-trader/correspondence-address-list").expect(200);
    });
});

// Test for incorrect form details entered, will return 400.
describe("POST /sole-trader/correspondence-address-list", () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post("/register-acsp/sole-trader/correspondence-address-list").send({ correspondenceAddress: "" }).expect(400);
    });
});
