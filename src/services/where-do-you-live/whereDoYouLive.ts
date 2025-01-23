import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class WhereDoYouLivBodyService {
    public getCountryPayload (ascpData: AcspData) {
        let payload = {};

        if (!ascpData.applicantDetails?.countryOfResidence) {
            return payload;
        }

        switch (ascpData.applicantDetails?.countryOfResidence) {
        case "England":
        case "Scotland":
        case "Wales":
        case "Northern Ireland":
            payload = { whereDoYouLiveRadio: ascpData?.applicantDetails?.countryOfResidence };
            break;
        default:
            payload = {
                whereDoYouLiveRadio: "countryOutsideUK",
                countryInput: ascpData.applicantDetails?.countryOfResidence
            };
        };
        return payload;
    }
}
