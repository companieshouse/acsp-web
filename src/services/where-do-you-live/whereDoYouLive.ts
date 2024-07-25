import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class WhereDoYouLivBodyService {
    public getCountryPayload (ascpData: AcspData): { payload: any, countryInput?: string } {
        let payload = {};
        let countryInput: string | undefined;

        switch (ascpData.countryOfResidence) {
        case "England":
        case "Scotland":
        case "Wales":
        case "Northern Ireland":
            payload = { whereDoYouLiveRadio: ascpData?.countryOfResidence };
            break;
        default:
            if (ascpData.countryOfResidence) {
                payload = { whereDoYouLiveRadio: "countryOutsideUK" };
                countryInput = ascpData.countryOfResidence;
            }
            break;

        }
        return { payload, countryInput };
    }
}
