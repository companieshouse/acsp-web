import supertest from "supertest";
import app from "../../../main/app";
import { SOLE_TRADER_TYPE_OF_BUSINESS, START, SOLE_TRADER_OTHER_TYPE_OFBUSINESS } from "../../../main/types/pageURL";
const router = supertest(app);

describe("GET " + SOLE_TRADER_TYPE_OF_BUSINESS, () => {
    it("should return status 200", async () => {
        await router.get(SOLE_TRADER_TYPE_OF_BUSINESS).expect(200);
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + SOLE_TRADER_TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(SOLE_TRADER_TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" }).expect(302);
    });
    it("should return status 302 after redirect", async () => {
        await router.post(SOLE_TRADER_TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "OTHER" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST " + SOLE_TRADER_TYPE_OF_BUSINESS, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(SOLE_TRADER_TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "" }).expect(400);
    });
});
