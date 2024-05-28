// src/test/src/controllers/unincorporatedNameRegisteredWithAmlController.test.ts
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { UNINCORPORATED_NAME_REGISTERED_WITH_AML, BASE_URL, UNINCORPORATED_WHAT_IS_YOUR_NAME, UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME } from "../../../../main/types/pageURL";
import { getAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "PARTNERSHIP",
    businessName: "Test Business"
};

describe("GET" + UNINCORPORATED_NAME_REGISTERED_WITH_AML, () => {
    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("Which name is registered with your Anti-Money Laundering (AML) supervisory body?");
    });

    it("should render the error page if an error is thrown in get function", async () => {
        mockGetAcspRegistration.mockImplementationOnce(() => { throw new Error(); });
        const res = await router.get(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML);
        expect(res.status).toBe(400);
        expect(res.text).toContain("Page not found");
    });
});

describe("POST" + UNINCORPORATED_NAME_REGISTERED_WITH_AML, () => {
    // Test for "Your name" selected will return 302 and redirect to "What is your name?" page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "YOUR_NAME" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME + "?lang=en");
    });

    // Test for "Name of the business" selected will return 302 and redirect to "What is the business name?" page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "NAME_OF_THE_BUSINESS" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_THE_BUSINESS_NAME + "?lang=en");
    });

    // Test for "Both" selected will return 302 and redirect to "What is the business name?" page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "BOTH" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + UNINCORPORATED_WHAT_IS_YOUR_NAME + "?lang=en");
    });

    // Test for no radio btn value selected, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(BASE_URL + UNINCORPORATED_NAME_REGISTERED_WITH_AML).send({ nameRegisteredWithAml: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select which name is registered with your AML supervisory body");
    });
});
