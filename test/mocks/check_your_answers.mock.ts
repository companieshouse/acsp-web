import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Company } from "../../src/model/Company";

export const mockCompany: Company = {
    companyName: "Test Company",
    companyNumber: "12345678",
    registeredOfficeAddress: {
        addressLineOne: "Address 1",
        addressLineTwo: "Address 2",
        careOf: "",
        country: "country",
        locality: "locality",
        poBox: "",
        postalCode: "AB1 2CD",
        premises: "premise",
        region: "region"
    }
};

export const mockLimitedAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "LC",
    roleType: "DIRECTOR",
    workSector: "AIA",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        }
    }
};
export const mockLLPAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "LLP",
    roleType: "MEMBER_OF_LLP",
    workSector: "FI",
    applicantDetails: {
        correspondenceAddress: {}
    }
};
export const mockSoleTraderAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "SOLE_TRADER",
    roleType: "SOLE_TRADER",
    workSector: "ILP",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        },
        firstName: "Unit",
        middleName: "Test",
        lastName: "User",
        dateOfBirth: new Date(1990, 10, 15),
        nationality: {
            firstNationality: "British"
        },
        countryOfResidence: "England"
    },
    businessName: "Test Business 123"
};
export const mockSoleTrader2AcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "SOLE_TRADER",
    roleType: "MEMBER_OF_GOVERNING_BODY",
    workSector: "CASINOS",
    applicantDetails: {
        firstName: "Unit",
        middleName: "Test",
        lastName: "User",
        dateOfBirth: new Date(1990, 10, 15),
        nationality: {
            firstNationality: "British",
            secondNationality: "German",
            thirdNationality: "Irish"
        },
        countryOfResidence: "England"
    },
    businessName: "Test Business 123"
};
export const mockPartnershipAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "PARTNERSHIP",
    roleType: "MEMBER_OF_PARTNERSHIP",
    workSector: "TCSP",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        }
    },
    businessName: "Test Business 123",
    howAreYouRegisteredWithAml: "NAME_OF_THE_BUSINESS",
    registeredOfficeAddress: {
        premises: "premises",
        addressLine1: "addressLine1",
        addressLine2: "addressLine2",
        locality: "locality",
        region: "region",
        postalCode: "postalcode"
    }
};
export const mockUnincorporatedAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "UNINCORPORATED",
    roleType: "MEMBER_OF_ENTITY",
    workSector: "CI",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        },
        firstName: "Test",
        lastName: "User"
    },
    businessName: "Test Business 123",
    howAreYouRegisteredWithAml: "BOTH",
    registeredOfficeAddress: {
        premises: "premises",
        addressLine1: "addressLine1",
        addressLine2: "addressLine2",
        locality: "locality",
        region: "region",
        postalCode: "postalcode"
    }
};
export const mockCorporateBodyAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "CORPORATE_BODY",
    roleType: "EQUIVALENT_OF_DIRECTOR",
    workSector: "EA",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        }
    },
    businessName: "Test Business 123",
    howAreYouRegisteredWithAml: "YOUR_NAME",
    registeredOfficeAddress: {}
};

export const mockLPAcspData: AcspData = {
    id: "1234",
    typeOfBusiness: "LP",
    roleType: "GENERAL_PARTNER",
    workSector: "HVD",
    applicantDetails: {
        correspondenceAddress: {
            premises: "premises",
            addressLine1: "addressLine1",
            addressLine2: "addressLine2",
            locality: "locality",
            region: "region",
            postalCode: "postalcode"
        },
        firstName: "Test",
        lastName: "User"
    },
    businessName: "Test Business 123",
    howAreYouRegisteredWithAml: "YOUR_NAME",
    registeredOfficeAddress: {
        premises: "premises",
        addressLine1: "addressLine1",
        addressLine2: "addressLine2",
        locality: "locality",
        region: "region",
        postalCode: "postalcode"
    }
};
