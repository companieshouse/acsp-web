import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe("GET /sole-trader/nationality", () => {
    it("should return status 200", async () => {
        await router.get("/register-acsp/sole-trader/nationality").expect(200);
    });
});

// Test for correct form with valid inputs, will return 302 after redirecting to the next page.
describe("POST /sole-trader/nationality", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "British", nationality_input_1: "French", nationality_input_2: "German" }).expect(302);
    });
});

// Test for correct form with valid input only first input populated, will return 302 after redirecting to the next page.
describe("POST /sole-trader/nationality", () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "British", nationality_input_1: "", nationality_input_2: "" }).expect(302);
    });
});

// Test for invalid input
describe("POST /sole-trader/nationality", () => {
    it("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "fewrfw", nationality_input_1: "rwerf", nationality_input_2: "pqfrgr" }).expect(400);
    });
});

// Test for invalid input
describe("POST /sole-trader/nationality", () => {
    it("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "rgwaet", nationality_input_1: "British", nationality_input_2: "erjfg" }).expect(400);
    });
});

// Test for  invalid input
describe("POST /sole-trader/nationality", () => {
    it("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "ergverb", nationality_input_1: "erbetb", nationality_input_2: "British" }).expect(400);
    });
});

// Test for invalid input
describe("POST /sole-trader/nationality", () => {
    it("should return status 400", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "British", nationality_input_1: "erbetb", nationality_input_2: "gjscjqechk" }).expect(400);
    });
});

// Test for empty input
describe("POST /sole-trader/nationality", () => {
    it("should fail validation with empty first nationality", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "", nationality_input_1: " ", nationality_input_2: "" }).expect(400);
    });
});

// Test for same inputs
describe("POST /sole-trader/nationality", () => {
    it("should fail validation with same inputs", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "British", nationality_input_1: "British", nationality_input_2: "British" }).expect(400);
    });
});

// Test for invalid and over the limit characters
describe("POST /sole-trader/nationality", () => {
    it("should fail validation with invalid nationality", async () => {
        await router.post("/register-acsp/sole-trader/nationality")
            .send({ nationality_input_0: "British", nationality_input_1: "Thelenghtofthisentenceisverylongoverthecharacterspecified", nationality_input_2: "British" }).expect(400);
    });
});
