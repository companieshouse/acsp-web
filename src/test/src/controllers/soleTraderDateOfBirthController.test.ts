import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe("GET /sole-trader/date-of-birth", () => {
    it("should return status 200", async () => {
        await router.get("/register-acsp/sole-trader/date-of-birth").expect(200);
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST /sole-trader/date-of-birth", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/register-acsp/sole-trader/date-of-birth").send({ "dob-day": "11", "dob-month": "02", "dob-year": "1999" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST /sole-trader/date-of-birth", () => {
    it("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/date-of-birth").send({ "dob-day": "32", "dob-month": "02", "dob-year": "1999" }).expect(400);
    });
});
