import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getBusinessName, getFullName, getFullNameACSPFullProfileDetails, formatDateIntoReadableString, formatAddressIntoHTMLString } from "../../../src/services/common";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

const acspProfileData: AcspData = {
    id: "1234",
    typeOfBusiness: "SOLE_TRADER",
    roleType: "MEMBER_OF_GOVERNING_BODY",
    workSector: "CASINOS",
    applicantDetails: {
        firstName: undefined,
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

const acspFullProfileData: AcspFullProfile = {
    number: "ABC3333",
    name: "Test name",
    status: "active",
    type: "LC",
    notifiedFrom: new Date(2024, 5, 2),
    email: "test@ch.gov.uk",
    amlDetails: [{
        supervisoryBody: "hm-revenue-customs-hmrc",
        membershipDetails: "123456789"
    }],
    registeredOfficeAddress: {
        premises: "11",
        addressLine1: "Test Street",
        postalCode: "AB1 2CD",
        country: "England"
    },
    soleTraderDetails: {
        forename: undefined,
        otherForenames: "test forename",
        surname: "test surname",
        nationality: "test nationality",
        usualResidentialCountry: "test country",
        dateOfBirth: new Date(1954, 5, 2)
    }
};

describe("CheckedDocumentsService tests", () => {
    it("should return full name as undefined when the fore name is undefined", () => {

        expect(getFullName(acspProfileData)).toBe(undefined);
    });
    it("should return full name as undefined when the fore name is undefined", () => {
        expect(getFullNameACSPFullProfileDetails(acspFullProfileData)).toBe(undefined);
    });
});

describe("getBusinessName should return correct business name", () => {
    it.each([
        ["John Doe ACSP", "John Doe"],
        ["John Doe acsp", "John Doe"],
        ["John Doe", "John Doe"],
        ["John acsp Doe", "John acsp Doe"]
    ])("should return correct business address for %s", (inputName, expectedName) => {
        const updatedName = getBusinessName(inputName);
        expect(updatedName).toEqual(expectedName);
    });
});

describe("formatDateIntoReadableString returns a formatted date string", () => {
    it("should return a formatted date string", () => {
        expect(formatDateIntoReadableString(new Date(2021, 2, 1))).toBe("01 March 2021");
    });
});

describe("formatAddressIntoHTMLString returns a formatted address string", () => {
    it("should return formatted address string with all fields", () => {
        const address = {
            premises: "11",
            addressLine1: "Test Street",
            addressLine2: "Test Area",
            locality: "Test City",
            region: "Test Region",
            country: "Test Country",
            postalCode: "AB1 2CD"
        };
        const expectedString = "11 Test Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Test Area</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Test City</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Test Region</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Test Country</p><p class=\"govuk-body govuk-!-margin-bottom-0\">AB1 2CD</p>";
        expect(formatAddressIntoHTMLString(address)).toBe(expectedString);
    });

    it("should return formatted address string with some fields missing", () => {
        const address = {
            addressLine1: "Test Street",
            locality: "Test City",
            country: "Test Country"
        };
        const expectedString = "Test Street<p class=\"govuk-body govuk-!-margin-bottom-0\">Test City</p><p class=\"govuk-body govuk-!-margin-bottom-0\">Test Country</p>";
        expect(formatAddressIntoHTMLString(address)).toBe(expectedString);
    });

    it("should return an empty string when address has no fields", () => {
        const address = {};
        expect(formatAddressIntoHTMLString(address)).toBe("");
    });

    it("should return an empty string when address is undefined", () => {
        expect(formatAddressIntoHTMLString(undefined)).toBe("");
    });
});
