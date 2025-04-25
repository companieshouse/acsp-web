import { AcspFullProfile, AmlDetails } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const MOCK_ACSP_NUMBER = "AP123456";

export const dummyFullProfile: AcspFullProfile = {
    number: MOCK_ACSP_NUMBER,
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
        country: "England",
        locality: "Test Town"
    },
    serviceAddress: {
        premises: "11",
        addressLine1: "Test Street",
        addressLine2: "Test Line 2",
        locality: "Test Town",
        region: "Region",
        country: "England",
        postalCode: "AB12CD"
    },
    soleTraderDetails: {
        usualResidentialCountry: "England",
        forename: "John",
        otherForenames: "A",
        surname: "Doe"
    }
};

export const create25AmlBodies = () => {
    const amlDetails: AmlDetails[] = [];
    for (let i = 1; i <= 25; i++) {
        amlDetails.push({
            supervisoryBody: `aml-supervisory-body-${i}`,
            membershipDetails: `membership-number-${i}`
        });
    }
    return amlDetails;
};
