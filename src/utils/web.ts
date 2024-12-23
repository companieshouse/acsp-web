import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
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
        "Isle of Man": "sle of Man"
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
    let name = acspFullProfileFullProfile.soleTraderDetails?.forename;

    if (acspFullProfileFullProfile.soleTraderDetails!.otherForenames !== undefined) {
        name += " " + acspFullProfileFullProfile.soleTraderDetails!.otherForenames;
    }
    name += " " + acspFullProfileFullProfile.soleTraderDetails!.surname!;
    return name;
};
