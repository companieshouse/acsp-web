import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { WhereDoYouLivBodyService } from "../../../../src/services/where-do-you-live/whereDoYouLive";

describe("WhereDoYouLiveBodyService", () => {

    let whereDoYouLiveBodyService: WhereDoYouLivBodyService;

    beforeEach(() => {
        whereDoYouLiveBodyService = new WhereDoYouLivBodyService();
    });

    it("should return payload for England", () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "England"
            }
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "England" });
    });

    it("should return payload for Scotland", () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "Scotland"
            }
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "Scotland" });

    });

    it("should return payload with countryOfResidence when applicantDetails is defined", () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);

        expect(payload).toEqual({});
    });

    it("should return payload for Wales", () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "Wales"
            }
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "Wales" });
    });

    it("should return payload for Northern Ireland", () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "Northern Ireland"
            }
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({ whereDoYouLiveRadio: "Northern Ireland" });
    });

    it("should return payload and countryInput for country outside UK", () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            applicantDetails: {
                countryOfResidence: "France"
            }
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({
            whereDoYouLiveRadio: "countryOutsideUK",
            countryInput: "France"
        });
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
        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({});
    });
});
