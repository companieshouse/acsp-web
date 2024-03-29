import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form with valid inputs, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "French", nationality_input_2: "German" }).expect(302);
    });
});

// Test for correct form with valid input only first input populated, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "", nationality_input_2: "" }).expect(302);
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "fewrfw", nationality_input_1: "rwerf", nationality_input_2: "pqfrgr" }).expect(400);
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "rgwaet", nationality_input_1: "British", nationality_input_2: "erjfg" }).expect(400);
    });
});

// Test for  invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "ergverb", nationality_input_1: "erbetb", nationality_input_2: "British" }).expect(400);
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "erbetb", nationality_input_2: "gjscjqechk" }).expect(400);
    });
});

// Test for empty input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with empty first nationality", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: " ", nationality_input_1: " ", nationality_input_2: " " }).expect(400);
    });
});

// Test for same inputs
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with same inputs", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: "British", nationality_input_2: "British" }).expect(400);
    });
});

// Test for invalid input
describe("POST" + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY, () => {
    it("should fail validation with invalid nationality", async () => {
        await router.post(BASE_URL + SOLE_TRADER_WHAT_IS_YOUR_NATIONALITY)
            .send({ nationality_input_0: "British", nationality_input_1: " ", nationality_input_2: "Italian" }).expect(400);
    });
});
