import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

import { LIMITED_NAME_REGISTERED_WITH_AML, BASE_URL } from "../../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    howAreYouRegisteredWithAml: "business name"
};

describe("GET" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);

    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test when radio btn selected, will return 302 after redirecting to the next page.
describe("POST" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 302 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "NAME_OF_THE_BUSINESS" }).expect(302);
    });
});
// Test for no radio btn value selected, will return 400.
describe("POST" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 400 after incorrect data entered", async () => {
        await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "" }).expect(400);
    });
});
