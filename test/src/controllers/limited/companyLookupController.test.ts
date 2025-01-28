import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER, LIMITED_IS_THIS_YOUR_COMPANY } from "../../../../src/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { AcspData, Company } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { CompanyLookupService } from "../../../../src/services/companyLookupService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/companyLookupService");
const router = supertest(app);

const mockCompanyLookupService = CompanyLookupService as jest.Mock;
const mockGetAcspRegistration = getAcspRegistration as jest.Mock;
const mockPutAcspRegistration = putAcspRegistration as jest.Mock;
const mockGetCompanyDetails = jest.fn();

mockCompanyLookupService.mockReturnValue({
    getCompanyDetails: mockGetCompanyDetails
});

const companyDetails: Company = {
    companyNumber: "123"
};
const acspData: AcspData = {
    id: "abc",
    typeOfBusiness: "LIMITED",
    companyDetails: companyDetails
};

describe("CompanyLookupController", () => {
    it("GET" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, async () => {
        mockGetAcspRegistration.mockResolvedValueOnce(acspData);
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200 when acspData is undefined", async () => {
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling GET endpoint and failing", async () => {
        mockGetAcspRegistration.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 302 after redirect", async () => {
        mockGetCompanyDetails.mockResolvedValueOnce(companyDetails);
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).send({ companyNumber: "12345678" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(BASE_URL + LIMITED_IS_THIS_YOUR_COMPANY + "?lang=en");
    });

    it("should return status 400 for no input", async () => {
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).send({ companyNumber: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter the company number");
    });

    it("should return status 400 for company number not found", async () => {
        mockGetCompanyDetails.mockRejectedValueOnce(new Error("Company Not Found"));
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).send({ companyNumber: "08694860" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter a valid company number");
    });

    it("should handle unexpected errors in the catch block and pass them to the next middleware", async () => {
        mockGetCompanyDetails.mockRejectedValueOnce(new Error("Unexpected Error"));
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).send({ companyNumber: "08694860" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should return status 400 for invalid company number", async () => {
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).send({ companyNumber: "@&£29864" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Company number must only include letters a to z and numbers");
    });

    it("should return status 400 for invalid company number", async () => {
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).send({ companyNumber: "NI5981260987654321" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Company number must be 8 characters");
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "12345678" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
