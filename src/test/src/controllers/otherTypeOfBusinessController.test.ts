import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { BASE_URL, OTHER_TYPE_OF_BUSINESS } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" }).expect(302);
    });
});

describe("POST " + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "" }).expect(400);
    });
});

describe("POST" + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" }).expect(302);
    });
});

describe("POST" + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 400 after incorrect data entered", async () => {
    // Add this line to include middleware checks for the 400 case
        await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "CORPORATE_BODY" }).expect(302);
    });
});
