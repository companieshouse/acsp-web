import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { BASE_URL, LIMITED_WHAT_IS_THE_COMPANY_NUMBER } from "../../../../main/types/pageURL";
import { getAcspRegistration, putAcspRegistration } from "../../../../main/services/acspRegistrationService";
import { AcspData, Company } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { CompanyLookupService } from "../../../../main/services/companyLookupService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
jest.mock("../../../../main/services/companyLookupService");
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
        expect(res.status).toBe(200);// render company number page
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();

    });
});

describe("POST" + LIMITED_WHAT_IS_THE_COMPANY_NUMBER, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: " " }).expect(400);
    });

    it("should return status 400 after redirect", async () => {
        mockGetCompanyDetails.mockRejectedValueOnce(new Error("Company number does not exist"));
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "08694860" }).expect(400);
    });

    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "@&£29864" }).expect(400);
    });

    it("should return status 400 after redirect", async () => {
        await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "NI5981260987654321" }).expect(400);
    });

    it("should show the error page if an error occurs during PUT request", async () => {
        mockPutAcspRegistration.mockRejectedValueOnce(new Error("Error PUTting data"));
        const res = await router.post(BASE_URL + LIMITED_WHAT_IS_THE_COMPANY_NUMBER)
            .send({ companyNumber: "12345678" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

/* test("POST" + LIMITED_COMPANY_NUMBER, async () => {
    const res = await router
        .post(BASE_URL + LIMITED_COMPANY_NUMBER)
        .send({ companyNumber: "NI038379" });

    expect(res.status).toBe(302);
}, 1000);// Redirect status code - valid company number */
