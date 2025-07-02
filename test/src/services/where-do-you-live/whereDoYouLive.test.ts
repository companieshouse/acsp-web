import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { WhereDoYouLiveBodyService } from "../../../../src/services/where-do-you-live/whereDoYouLive";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

let whereDoYouLiveBodyService: WhereDoYouLiveBodyService;
describe("WhereDoYouLiveBodyService", () => {

    beforeEach(() => {
        whereDoYouLiveBodyService = new WhereDoYouLiveBodyService();
    });

    const testCases = [
        { country: "England", expected: { whereDoYouLiveRadio: "England" } },
        { country: "ENGLAND", expected: { whereDoYouLiveRadio: "England" } },
        { country: "Scotland", expected: { whereDoYouLiveRadio: "Scotland" } },
        { country: "Wales", expected: { whereDoYouLiveRadio: "Wales" } },
        { country: "Northern Ireland", expected: { whereDoYouLiveRadio: "Northern Ireland" } },
        { country: "NORTHERN IRELAND", expected: { whereDoYouLiveRadio: "Northern Ireland" } },
        { country: "France", expected: { whereDoYouLiveRadio: "countryOutsideUK", countryInput: "France" } },
        { country: undefined, expected: {} }
    ];

    testCases.forEach(({ country, expected }) => {
        it(`should return correct payload for ${country || "undefined country"} in Registration journey`, () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                applicantDetails: country ? {
                    countryOfResidence: country
                } : {}
            };

            const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
            expect(payload).toEqual(expected);
        });
    });

    testCases.forEach(({ country, expected }) => {
        it(`should return correct payload for ${country || "undefined country"} in Update journey`, () => {
            const acspData: AcspFullProfile = {
                number: "",
                name: "",
                status: "",
                type: "",
                notifiedFrom: new Date(),
                email: "",
                amlDetails: [],
                registeredOfficeAddress: {},
                soleTraderDetails: country ? {
                    usualResidentialCountry: country
                } : {}
            };

            const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
            expect(payload).toEqual(expected);
        });
    });

    it(`should return correct payload for applicantDetails undefined in Registration journey`, () => {
        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({});
    });

    it(`should return correct payload for soleTraderDetails undefined in Update journey`, () => {
        const acspData: AcspFullProfile = {
            number: "",
            name: "",
            status: "",
            type: "",
            notifiedFrom: new Date(),
            email: "",
            amlDetails: [],
            registeredOfficeAddress: {}
        };

        const payload = whereDoYouLiveBodyService.getCountryPayload(acspData);
        expect(payload).toEqual({});
    });
});

describe("WhereDoYouLiveBodyService - getCountryPayloadFromCountryName", () => {
    let service: WhereDoYouLiveBodyService;

    beforeEach(() => {
        service = new WhereDoYouLiveBodyService();
    });

    it("should return the correct payload for a UK country (England)", () => {
        const result = service.getCountryPayloadFromCountryName("England");
        expect(result).toEqual({ whereDoYouLiveRadio: "England" });
    });

    it("should return the correct payload for a UK country (Scotland)", () => {
        const result = service.getCountryPayloadFromCountryName("Scotland");
        expect(result).toEqual({ whereDoYouLiveRadio: "Scotland" });
    });

    it("should return the correct payload for a UK country (Wales)", () => {
        const result = service.getCountryPayloadFromCountryName("Wales");
        expect(result).toEqual({ whereDoYouLiveRadio: "Wales" });
    });

    it("should return the correct payload for a UK country (Northern Ireland)", () => {
        const result = service.getCountryPayloadFromCountryName("Northern Ireland");
        expect(result).toEqual({ whereDoYouLiveRadio: "Northern Ireland" });
    });

    it("should return the correct payload for a country outside the UK", () => {
        const result = service.getCountryPayloadFromCountryName("France");
        expect(result).toEqual({
            whereDoYouLiveRadio: "countryOutsideUK",
            countryInput: "France"
        });
    });

    it("should handle case-insensitive input for UK countries", () => {
        const result = service.getCountryPayloadFromCountryName("england");
        expect(result).toEqual({ whereDoYouLiveRadio: "England" });
    });

    it("should handle case-insensitive input for countries outside the UK", () => {
        const result = service.getCountryPayloadFromCountryName("france");
        expect(result).toEqual({
            whereDoYouLiveRadio: "countryOutsideUK",
            countryInput: "France"
        });
    });

    it("should handle input with mixed casing for UK countries", () => {
        const result = service.getCountryPayloadFromCountryName("eNgLaNd");
        expect(result).toEqual({ whereDoYouLiveRadio: "England" });
    });

    it("should handle input with mixed casing for countries outside the UK", () => {
        const result = service.getCountryPayloadFromCountryName("fRaNcE");
        expect(result).toEqual({
            whereDoYouLiveRadio: "countryOutsideUK",
            countryInput: "France"
        });
    });
});
