import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, SOLE_TRADER_DATE_OF_BIRTH } from "../../../main/types/pageURL";
jest.mock("@companieshouse/api-sdk-node");

const router = supertest(app);

describe("GET" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send({ "dob-day": "11", "dob-month": "02", "dob-year": "1999" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST" + SOLE_TRADER_DATE_OF_BIRTH, () => {
    it("should return status 400", async () => {
        await router.post(BASE_URL + SOLE_TRADER_DATE_OF_BIRTH).send({ "dob-day": "32", "dob-month": "02", "dob-year": "1999" }).expect(400);
    });
});
