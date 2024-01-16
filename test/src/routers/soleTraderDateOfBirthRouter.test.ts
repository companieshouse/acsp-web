import supertest from "supertest";
import app from "../../../src/app";
const router = supertest(app);

describe("GET /sole-trader/date-of-birth", () => {
    it("should return status 200", async () => {
        await router.get("/sole-trader/date-of-birth").expect(200);
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST /sole-trader/date-of-birth", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/sole-trader/date-of-birth").send({ dobDay: "11", dobMonth: "02", dobYear: "1999" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST /sole-trader/date-of-birth", () => {
    it("should return status 400", async () => {
        await router.post("/sole-trader/date-of-birth").send({ dobDay: "32", dobMonth: "02", dobYear: "2010" }).expect(400);
    });
});
