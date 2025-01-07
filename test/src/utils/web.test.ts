import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getFullName, getFullNameACSPFullProfileDetails } from "../../../src/utils/web";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

describe("CheckedDocumentsService tests", () => {
    it("should return full name as undefined when the fore name is undefined", () => {
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
        expect(getFullName(acspProfileData)).toBe(undefined);
    });
    it("should return full name as undefined when the fore name is undefined", () => {
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
        expect(getFullNameACSPFullProfileDetails(acspFullProfileData)).toBe(undefined);
    });
});
