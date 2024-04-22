import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { TYPE_OF_BUSINESS, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + TYPE_OF_BUSINESS, () => {
    xit("should return status 200", async () => {
        await router.get(BASE_URL + TYPE_OF_BUSINESS).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "LIMITED_COMPANY" }).expect(302);
    });
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "OTHER" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST " + TYPE_OF_BUSINESS, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + TYPE_OF_BUSINESS).send({ typeOfBusinessRadio: "" }).expect(400);
    });
});
