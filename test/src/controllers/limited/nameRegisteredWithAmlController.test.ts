import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

import { LIMITED_NAME_REGISTERED_WITH_AML, BASE_URL, LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS, LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT } from "../../../../src/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    howAreYouRegisteredWithAml: "business name",
    applicantDetails: {
        firstName: "John",
        lastName: "Doe"
    }
};

describe("GET" + LIMITED_NAME_REGISTERED_WITH_AML, () => {

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Which name is registered with your Anti-Money Laundering (AML) supervisory body?");
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + LIMITED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "NAME_OF_THE_BUSINESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_WHAT_IS_THE_CORRESPONDENCE_ADDRESS + "?lang=en");
    });

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "YOUR_NAME" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT + "?lang=en");
    });

    // Test for no radio btn value selected, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which name is registered with your AML supervisory body");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "NAME_OF_THE_BUSINESS" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
