import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { LIMITED_BUSINESS_TYPES } from "../common/__utils/constants";
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
        addressString += `<p class="govuk-body govuk-!-margin-bottom-0">${address.addressLine2}</p>`;
    }
    if (address.locality) {
        addressString += `<p class="govuk-body govuk-!-margin-bottom-0">${address.locality}</p>`;
    }
    if (address.region) {
        addressString += `<p class="govuk-body govuk-!-margin-bottom-0">${address.region}</p>`;
    }
    if (address.country) {
        addressString += `<p class="govuk-body govuk-!-margin-bottom-0">${address.country}</p>`;
    }
    if (address.postalCode) {
        addressString += `<p class="govuk-body govuk-!-margin-bottom-0">${address.postalCode}</p>`;
    }
    return addressString;
};

export const trimAndLowercaseString = (name: string | undefined): string => {
    if (!name) {
        return "";
    }
    return name.trim().toLowerCase().replace(/\s+/g, " ");
};

export const isLimitedBusinessType = (type: string | undefined, businessTypes: string[] = LIMITED_BUSINESS_TYPES): boolean => {
    return type ? businessTypes.includes(type) : false;
};

export const deepEquals = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) {return true;}

    if (obj1 == null || obj2 == null || typeof obj1 !== "object" || typeof obj2 !== "object") {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {return false;}

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEquals(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;

};
