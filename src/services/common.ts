import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

/**
 * Map the country key returned by postcode lookup to a readable format
 */
export const getCountryFromKey = (country: string): string => {
    const countryKeyValueMap: Record<string, string> = {
        "GB-SCT": "Scotland",
        "GB-WLS": "Wales",
        "GB-ENG": "England",
        "GB-NIR": "Northern Ireland",
        "Channel Island": "Channel Island",
        "Isle of Man": "Isle of Man"
    };
    return countryKeyValueMap[country];
};

export const getFullName = (acspData: AcspData): string | undefined => {
    if (acspData.applicantDetails!.firstName === undefined) {
        return undefined;
    }
    let name = acspData.applicantDetails!.firstName;
    if (acspData.applicantDetails!.middleName !== undefined) {
        name += " " + acspData.applicantDetails!.middleName;
    }
    name += " " + acspData.applicantDetails!.lastName!;
    return name;
};

export const getFullNameACSPFullProfileDetails = (acspFullProfileFullProfile: AcspFullProfile): string | undefined => {
    if (acspFullProfileFullProfile.soleTraderDetails!.forename === undefined) {
        return undefined;
    }
    let name = acspFullProfileFullProfile.soleTraderDetails!.forename;

    if (acspFullProfileFullProfile.soleTraderDetails!.otherForenames !== undefined) {
        name += " " + acspFullProfileFullProfile.soleTraderDetails!.otherForenames;
    }
    name += " " + acspFullProfileFullProfile.soleTraderDetails!.surname!;
    return name;
};

export const getBusinessName = (name: string): string => {
    let updatedName: string;
    const businessName = name.trim();
    if (businessName.toUpperCase().endsWith("ACSP")) {
        updatedName = businessName.slice(0, -4).trimEnd();
    } else {
        updatedName = businessName;
    }
    return updatedName;
};

export const formatDateIntoReadableString = (date: Date): string => {
    return date.toLocaleDateString("en-UK", { day: "2-digit", month: "long", year: "numeric" });
};

export const formatAddressIntoHTMLString = (address: Address | undefined): string => {
    let addressString = "";
    if (!address) {
        return addressString;
    }
    if (address.premises) {
        addressString += address.premises;
    }
    if (address.addressLine1) {
        addressString += (addressString ? " " : "") + address.addressLine1;
    }
    if (address.addressLine2) {
        addressString += "<br>" + address.addressLine2;
    }
    if (address.locality) {
        addressString += "<br>" + address.locality;
    }
    if (address.region) {
        addressString += "<br>" + address.region;
    }
    if (address.country) {
        addressString += "<br>" + address.country;
    }
    if (address.postalCode) {
        addressString += "<br>" + address.postalCode;
    }
    return addressString;
};
