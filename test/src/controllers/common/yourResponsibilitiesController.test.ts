import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { YOUR_RESPONSIBILITIES, BASE_URL, CHECK_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");

const router = supertest(app);

const mockGetAcspRegistration = getAcspRegistration as jest.Mock;

const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "SOLE_TRADER",
    businessName: "BUSINESS NAME",
    applicantDetails: {
        firstName: "JOHN",
        lastName: "DOE"
    }
};

describe("GET" + YOUR_RESPONSIBILITIES, () => {

    it("should return status 200", async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + YOUR_RESPONSIBILITIES);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Your responsibilities as an authorised agent");
    });

    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + YOUR_RESPONSIBILITIES);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 applicantDetails is undefined", async () => {
        const acspData2: AcspData = {
            id: "abc"
        };
        mockGetAcspRegistration.mockResolvedValueOnce(acspData2);
        const res = await router.get(BASE_URL + YOUR_RESPONSIBILITIES);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Your responsibilities as an authorised agent");
    });
});

// Test will return 302 after redirecting to the next page.
describe("POST" + YOUR_RESPONSIBILITIES, () => {

    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + YOUR_RESPONSIBILITIES);
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + CHECK_YOUR_ANSWERS + "?lang=en");
    });
});
