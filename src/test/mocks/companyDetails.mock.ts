import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";

export const validCompanyProfile: CompanyProfile = {
    accounts: {
        nextAccounts: {
            periodEndOn: "2019-10-10",
            periodStartOn: "2019-01-01"
        },
        nextDue: "2020-05-31",
        overdue: false
    },
    companyName: "Test Company",
    companyNumber: "12345678",
    companyStatus: "active",
    companyStatusDetail: "company status detail",
    confirmationStatement: {
        lastMadeUpTo: "2019-04-30",
        nextDue: "2020-04-30",
        nextMadeUpTo: "2020-03-15",
        overdue: false
    },
    dateOfCreation: "1972-06-22",
    hasBeenLiquidated: false,
    hasCharges: false,
    hasInsolvencyHistory: false,
    jurisdiction: "england-wales",
    links: {},
    registeredOfficeAddress: {
        addressLineOne: "Line1",
        addressLineTwo: "Line2",
        careOf: "careOf",
        country: "uk",
        locality: "locality",
        poBox: "123",
        postalCode: "POST CODE",
        premises: "premises",
        region: "region"
    },
    sicCodes: ["123"],
    type: "limited"
};

export const validDeactiveCompanyProfile: CompanyProfile = {
    accounts: {
        nextAccounts: {
            periodEndOn: "2019-10-10",
            periodStartOn: "2019-01-01"
        },
        nextDue: "2020-05-31",
        overdue: false
    },
    companyName: "Test Company",
    companyNumber: "12345678",
    companyStatus: "inactive",
    companyStatusDetail: "company status detail",
    confirmationStatement: {
        lastMadeUpTo: "2019-04-30",
        nextDue: "2020-04-30",
        nextMadeUpTo: "2020-03-15",
        overdue: false
    },
    dateOfCreation: "1972-06-22",
    hasBeenLiquidated: false,
    hasCharges: false,
    hasInsolvencyHistory: false,
    jurisdiction: "england-wales",
    links: {},
    registeredOfficeAddress: {
        addressLineOne: "Line1",
        addressLineTwo: "Line2",
        careOf: "careOf",
        country: "uk",
        locality: "locality",
        poBox: "123",
        postalCode: "POST CODE",
        premises: "premises",
        region: "region"
    },
    sicCodes: ["123"],
    type: "ltd"
};

export const validSDKResource: Resource<CompanyProfile> = {
    httpStatusCode: 200,
    resource: validCompanyProfile
};
