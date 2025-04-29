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

        switch (this.capitalizeFirstLetter(countryOfResidence)) {
        case "England":
        case "Scotland":
        case "Wales":
        case "Northern Ireland":
            return { whereDoYouLiveRadio: this.capitalizeFirstLetter(countryOfResidence) };
        default:
            return {
                whereDoYouLiveRadio: "countryOutsideUK",
                countryInput: countryOfResidence
            };
        }
    }

    getCountryPayloadInProgress (countryName: string) {

        switch (this.capitalizeFirstLetter(countryName)) {
        case "England":
        case "Scotland":
        case "Wales":
        case "Northern Ireland":
            return { whereDoYouLiveRadio: this.capitalizeFirstLetter(countryName) };
        default:
            return {
                whereDoYouLiveRadio: "countryOutsideUK",
                countryInput: this.capitalizeFirstLetter(countryName)
            };
        }
    }

    private capitalizeFirstLetter (string: string): string {
        string = string.toLowerCase();
        const words = string.split(" ");
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        return words.join(" ");
    }
}
