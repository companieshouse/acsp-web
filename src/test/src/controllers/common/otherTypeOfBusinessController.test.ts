import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

import { BASE_URL, OTHER_TYPE_OF_BUSINESS, UNINCORPORATED_NAME_REGISTERED_WITH_AML } from "../../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "OTHER"
};

describe("GET " + OTHER_TYPE_OF_BUSINESS, () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + OTHER_TYPE_OF_BUSINESS);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("What other type of business are you registering?");
    });
});

// Test for correct form details entered, will return 302 after redirecting to the next page.
describe("POST " + OTHER_TYPE_OF_BUSINESS, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "UNINCORPORATED_ENTITY" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        // Add this line to include middleware checks for the 400 case
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "CORPORATE_BODY" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML + "?lang=en");
    });

    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + OTHER_TYPE_OF_BUSINESS).send({ otherTypeOfBusinessRadio: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the type of business you are registering");
    });
});
