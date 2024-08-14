import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { WhereDoYouLivBodyService } from "../../../../src/services/where-do-you-live/whereDoYouLive";

describe("WhereDoYouLiveBodyService", () => {
    it("should return payload for England", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "England"
            }
        };

        const { payload, countryInput } = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "England" });
        expect(countryInput).toBeUndefined();
    });

    it("should return payload for Scotland", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "Scotland"
            }
        };

        const { payload, countryInput } = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "Scotland" });
        expect(countryInput).toBeUndefined();
    });

    it("should return payload with countryOfResidence when applicantDetails is defined", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };
    
        const { payload, countryInput } = whereDoYouLiveBodyService.getCountryPayload(acspData);
    
        expect(payload).toEqual({});
        expect(countryInput).toBeUndefined();
    });
    

    it("should return payload for Wales", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "Wales"
            }
        };

        const { payload, countryInput } = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "Wales" });
        expect(countryInput).toBeUndefined();
    });

    it("should return payload for Northern Ireland", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "Northern Ireland"
            }
        };

        const { payload, countryInput } = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "Northern Ireland" });
        expect(countryInput).toBeUndefined();
    });

    it("should return payload and countryInput for country outside UK", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "France"
            }
        };

        const { payload, countryInput } =
      whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "countryOutsideUK" });
        expect(countryInput).toEqual("France");
    });

    it("should return empty payload if countryOfResidence is not valid", () => {
        const whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: undefined
            }
        };

        const { payload, countryInput } = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({});
        expect(countryInput).toBeUndefined();
    });
});
