import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export class WhereDoYouLiveBodyService {
    getCountryPayload (ascpData: AcspData | AcspFullProfile) {
        let countryOfResidence;
        if ("applicantDetails" in ascpData) {
            countryOfResidence = ascpData.applicantDetails?.countryOfResidence;
        } else if ("soleTraderDetails" in ascpData) {
            countryOfResidence = ascpData.soleTraderDetails?.usualResidentialCountry;
        }
        if (!countryOfResidence) {
            return {};
        }
        switch (countryOfResidence) {
        case "England":
        case "Scotland":
        case "Wales":
        case "Northern Ireland":
            return { whereDoYouLiveRadio: countryOfResidence };
        default:
            return {
                whereDoYouLiveRadio: "countryOutsideUK",
                countryInput: countryOfResidence
            };
        }
    }
}
