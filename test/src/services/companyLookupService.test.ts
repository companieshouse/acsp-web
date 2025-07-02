import { Request } from "express";
import { getCompanyProfile } from "../../../src/services/company/company_profile_service";
import { createRequest, MockRequest } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";
import { companyProfile, validCompanyProfile } from "../../mocks/company_profile_mock";
import { CompanyLookupService } from "../../../src/services/companyLookupService";
import { COMPANY_DETAILS } from "../../../src/common/__utils/constants";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/company/company_profile_service");

const mockGetCompanyProfie = getCompanyProfile as jest.Mock;

describe("getCompany tests", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    it("should return company profile", async () => {
        mockGetCompanyProfie.mockResolvedValueOnce(validCompanyProfile);
        const companyLookupService = new CompanyLookupService();
        const res = await companyLookupService.getCompany("12345678");
        expect(res).toEqual(validCompanyProfile);
    });

    it("should throw an error when getCompanyProfile errors", async () => {
        mockGetCompanyProfie.mockRejectedValueOnce(new Error("Error getting company profile"));
        const companyLookupService = new CompanyLookupService();
        expect(companyLookupService.getCompany("12345678")).rejects.toThrow();
    });
});

describe("getCompanyDetails tests", () => {
    let req: MockRequest<Request>;
    const companyLookupService = new CompanyLookupService();
    beforeEach(() => {
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    it("should save company details to session", async () => {
        const session: Session = req.session as any as Session;
        mockGetCompanyProfie.mockResolvedValueOnce(companyProfile);
        await companyLookupService.getCompanyDetails("12345678", req);
        expect(session.getExtraData(COMPANY_DETAILS)).toEqual({
            companyName: validCompanyProfile.companyName,
            companyNumber: validCompanyProfile.companyNumber,
            registeredOfficeAddress: {
                addressLineOne: "",
                addressLineTwo: "",
                careOf: "",
                country: "",
                locality: "",
                poBox: "",
                postalCode: "",
                premises: "",
                region: ""
            },
            incorporationDate: "03 March 2022",
            status: "Active",
            companyType: "Private Limited Company"
        });
    });
    it("should throw an eror if getCompany returns a promise reject", async () => {
        jest.spyOn(companyLookupService, "getCompany").mockImplementation(() => {
            return Promise.reject(new Error("Error getting company"));
        });
        await expect(companyLookupService.getCompanyDetails("12345678", req)).rejects.toThrow("Company Not Found");
    });
});
