import { Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const address1: Address = {
    propertyDetails: "1",
    line1: "Mock Street",
    line2: "Mock Line 2",
    town: "Mock Town",
    county: "Mock County",
    country: "Mock Country",
    postcode: "AB12CD"
};

export const address2: Address = {
    propertyDetails: "2",
    line1: "Mock Street",
    line2: "Mock Line 2",
    town: "Mock Town",
    county: "Mock County",
    country: "Mock Country",
    postcode: "AB12CD"
};

export const addressList: Array<Address> = [address1, address2];
