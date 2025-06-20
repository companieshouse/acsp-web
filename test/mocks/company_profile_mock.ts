import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
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

export const companyProfile: CompanyProfile = {
    companyName: "Test Company",
    companyNumber: "123456",
    companyStatus: "active",
    type: "ltd",
    companyStatusDetail: "",
    dateOfCreation: "2022-03-03",
    jurisdiction: "",
    sicCodes: [],
    hasBeenLiquidated: false,
    hasCharges: false,
    hasInsolvencyHistory: false,
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
    accounts: {
        nextAccounts: {
            periodEndOn: "",
            periodStartOn: ""
        },
        nextDue: "",
        overdue: false
    },
    links: {},
    subtype: ""
};
