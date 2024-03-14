import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";

import { TYPE_OF_BUSINESS, START, OTHER_TYPE_OFBUSINESS } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + OTHER_TYPE_OFBUSINESS, () => {
    it("should return status 200", async () => {
        await router.get("/register-as-companies-house-authorised-agent/" + OTHER_TYPE_OFBUSINESS).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + OTHER_TYPE_OFBUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        await router.post("/register-as-companies-house-authorised-agent/" + OTHER_TYPE_OFBUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" }).expect(302);
    });
});
// Test for incorrect form details entered, will return 400.
describe("POST " + OTHER_TYPE_OFBUSINESS, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post("/register-as-companies-house-authorised-agent/" + OTHER_TYPE_OFBUSINESS).send({ otherTypeOfBusinessRadio: "" }).expect(400);
    });
});
