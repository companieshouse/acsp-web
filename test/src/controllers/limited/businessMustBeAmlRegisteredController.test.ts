import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";

import { LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, BASE_URL, AML_REGISTRATION, TYPE_OF_BUSINESS } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED"
};

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;

describe("GET" + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT, () => {
    mockGetAcspRegistration.mockResolvedValueOnce(acspData);
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(200);
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.get(BASE_URL + LIMITED_BUSINESS_MUSTBE_AML_REGISTERED_KICKOUT);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
