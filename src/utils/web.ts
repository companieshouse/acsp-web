import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

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
