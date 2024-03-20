import { Company } from "../../../src/main/model/Company";

jest.mock("../../../src/main/services/company/company_profile_service");

export const validCompanyProfile: Company = {
    companyName: "Test Company",
    companyNumber: "123456",
    status: "active",
    incorporationDate: "2022-01-01",
    companyType: "Limited",
    registeredOfficeAddress: {}
};

export const invalidCompanyProfile: Company = {
    companyName: "Test Company",
    companyNumber: "123456",
    status: "inactive",
    incorporationDate: "2022-01-01",
    companyType: "Limited",
    registeredOfficeAddress: {}
};
