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
