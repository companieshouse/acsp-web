import { Company } from "../../src/model/Company";

jest.mock("../../src/services/company/company_profile_service");

export const validCompanyProfile: Company = {
    companyName: "Test Company",
    companyNumber: "123456",
    status: "active",
    incorporationDate: "2022-01-01",
    companyType: "Limited"
};

export const invalidCompanyProfile: Company = {
    companyName: "Test Company",
    companyNumber: "123456",
    status: "inactive",
    incorporationDate: "2022-01-01",
    companyType: "Limited"
};
