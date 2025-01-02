import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const mockLimitedAcspFullProfile: AcspFullProfile = {
            number: "AP123456",
            name: "Example ACSP Ltd",
            status: "active",
            type: "limited-company",
            notifiedFrom : new Date(1990, 10, 15),
            deauthorisedFrom: new Date(1990, 10, 15) ,
            email: "john.doe@example.com",
            amlDetails: [{
                supervisoryBody: "financial-conduct-authority-fca",
                membershipDetails: "Membership ID: FCA123456"
            }],
            registeredOfficeAddress: {
                careOf: "Jane Smith",
                addressLine1: "456 Another Street",
                addressLine2: "Floor 2",
                country: "united-kingdom",
                locality: "Manchester",
                poBox: "PO Box 123",
                postalCode: "M1 2AB",
                premises: "Another Building",
                region: "Greater Manchester"
            },
            serviceAddress: {
                careOf: "Jane Smith",
                addressLine1: "456 Another Street",
                addressLine2: "Floor 2",
                country: "united-kingdom",
                locality: "Manchester",
                poBox: "PO Box 123",
                postalCode: "M1 2AB",
                premises: "Another Building",
                region: "Greater Manchester"
            },
            soleTraderDetails:{
                forename: "",
                otherForenames: "",
                surname: "",
                nationality: "",
                usualResidentialCountry: "",
                dateOfBirth: new Date()
            }
};

export const mockSoleTraderAcspFullProfile: AcspFullProfile = {
    number: "AP654321",
    name: "John Doe",
    status: "active",
    type: "sole-trader",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockUnincorporatedAcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutPremisesAcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutAddressLine1AcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutAddressLine2AcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutLocalityAcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutRegionAcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutCountryAcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        locality: "Manchester",
        poBox: "PO Box 123",
        postalCode: "M1 2AB",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};

export const mockAddressWithoutPostalCodeAcspFullProfile: AcspFullProfile = {
    number: "AP135790",
    name: "John Doe",
    status: "active",
    type: "unincorporated-entity",
    notifiedFrom : new Date(1990, 10, 15),
    deauthorisedFrom: new Date(1990, 10, 15) ,
    email: "john.doe@example.com",
    amlDetails: [{
        supervisoryBody: "financial-conduct-authority-fca",
        membershipDetails: "Membership ID: FCA654321"
    }],
    registeredOfficeAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    serviceAddress: {
        careOf: "Jane Smith",
        addressLine1: "456 Another Street",
        addressLine2: "Floor 2",
        country: "united-kingdom",
        locality: "Manchester",
        poBox: "PO Box 123",
        premises: "Another Building",
        region: "Greater Manchester"
    },
    soleTraderDetails:{
        forename: "John",
        otherForenames: "A.",
        surname: "Doe",
        nationality: "British",
        usualResidentialCountry: "united-kingdom",
        dateOfBirth: new Date(1990, 10, 15)
    }
};