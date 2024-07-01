import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AmlSupervisoryBodyService } from "../../../src/services/amlSupervisoryBody/amlBodyService";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp/types";

describe("AmlSupervisoryBodyService", () => {
    it("should save selected AML supervisory bodies to session when more then one selection is selected", () => {
        const sessionMock: Partial<Session> = {
            setExtraData: jest.fn()
        };

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": ["Association of Chartered Certified Accountants (ACCA)", "Association of Accounting Technicians (AAT)"]
            }
        };

        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodies.push({
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
        },
        {
            amlSupervisoryBody: "Association of Accounting Technicians (AAT)"
        });

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(requestMock as Request, acspData as AcspData);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodies);
    });

    it("should save selected AML supervisory body to session when only one is selected", () => {
        const sessionMock: Partial<Session> = {
            setExtraData: jest.fn()
        };

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": "Association of Chartered Certified Accountants (ACCA)"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
        });

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(requestMock as Request, acspData as AcspData);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodiesExpected);
    });

    it("Previously added data in acspData getting replaced", () => {
        const sessionMock: Partial<Session> = {
            setExtraData: jest.fn()
        };

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": "Association of Chartered Certified Accountants (ACCA)"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
        });

        const amlBody1 : AmlSupervisoryBody = {
            amlSupervisoryBody: "HMRC",
            membershipId: "12345678"
        };
        const amlBody2 : AmlSupervisoryBody = {
            amlSupervisoryBody: "HMRC",
            membershipId: "12345678"
        };

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            amlSupervisoryBodies: [amlBody1, amlBody2]
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(requestMock as Request, acspData as AcspData);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodiesExpected);
    });

    it("Previously added data in acspData getting partly replaced", () => {
        const sessionMock: Partial<Session> = {
            setExtraData: jest.fn()
        };

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": "Association of Chartered Certified Accountants (ACCA)",
                id: "12345678"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
            membershipId: "12345678"
        });

        const amlBody1 : AmlSupervisoryBody = {
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
            membershipId: "12345678"
        };
        const amlBody2 : AmlSupervisoryBody = {
            amlSupervisoryBody: "HMRC",
            membershipId: "12345678"
        };

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            amlSupervisoryBodies: [amlBody1, amlBody2]
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(requestMock as Request, acspData as AcspData);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodiesExpected);
    });

    it("Get selected AML", () => {
        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push(
            {
                amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
                membershipId: "12345678"
            },
            {
                amlSupervisoryBody: "HMRC",
                membershipId: "12345678"
            }
        );

        const amlBody1 : AmlSupervisoryBody = {
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)",
            membershipId: "12345678"
        };
        const amlBody2 : AmlSupervisoryBody = {
            amlSupervisoryBody: "HMRC",
            membershipId: "12345678"
        };

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            amlSupervisoryBodies: [amlBody1, amlBody2]
        };

        const selectedAMLSupervisoryBodies: string[] = [];

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.getSelectedAML(acspData as AcspData, selectedAMLSupervisoryBodies);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodiesExpected);
    });

    it("Save data to ACSPData object", () => {

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": "Association of Chartered Certified Accountants (ACCA)"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
        });

        const amlBody1 : AmlSupervisoryBody = {
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
        };

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED",
            amlSupervisoryBodies: [amlBody1]
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveAmlSupervisoryBodies(requestMock as Request, acspData as AcspData);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodiesExpected);
    });

    describe("getCountryPayload", () => {
        let amlSupervisoryBodyService: AmlSupervisoryBodyService;

        beforeEach(() => {
            amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        });

        it("should return payload for England", () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                countryOfResidence: "England"
            };

            const { payload, countryInput } = amlSupervisoryBodyService.getCountryPayload(acspData);
            expect(payload).toEqual({ whereDoYouLiveRadio: "England" });
            expect(countryInput).toBeUndefined();
        });

        it("should return payload for Scotland", () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                countryOfResidence: "Scotland"
            };

            const { payload, countryInput } = amlSupervisoryBodyService.getCountryPayload(acspData);
            expect(payload).toEqual({ whereDoYouLiveRadio: "Scotland" });
            expect(countryInput).toBeUndefined();
        });
    

        it("should return payload for Wales", () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                countryOfResidence: "Wales"
            };

            const { payload, countryInput } = amlSupervisoryBodyService.getCountryPayload(acspData);
            expect(payload).toEqual({ whereDoYouLiveRadio: "Wales" });
            expect(countryInput).toBeUndefined();
        });

        it("should return payload for Northern Ireland", () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                countryOfResidence: "Northern-Ireland"
            };

            const { payload, countryInput } = amlSupervisoryBodyService.getCountryPayload(acspData);
            expect(payload).toEqual({ whereDoYouLiveRadio: "Northern-Ireland" });
            expect(countryInput).toBeUndefined();
        });

        it("should return payload and countryInput for country outside UK", () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                countryOfResidence: "France"
            };

            const { payload, countryInput } = amlSupervisoryBodyService.getCountryPayload(acspData);
            expect(payload).toEqual({ whereDoYouLiveRadio: "countryOutsideUK" });
            expect(countryInput).toEqual("France");
        });

        it("should return empty payload if countryOfResidence is not valid", () => {
            const acspData: AcspData = {
                id: "abc",
                typeOfBusiness: "LIMITED",
                countryOfResidence: undefined
            };

            const { payload, countryInput } = amlSupervisoryBodyService.getCountryPayload(acspData);
            expect(payload).toEqual({});
            expect(countryInput).toBeUndefined();
        });
    });
});

