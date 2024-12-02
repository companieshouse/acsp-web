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
                "AML-supervisory-bodies": ["association of chartered certified accountants (acca)", "association of accounting technicians (aat)"]
            }
        };

        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodies.push({
            amlSupervisoryBody: "association of chartered certified accountants (acca)"
        },
        {
            amlSupervisoryBody: "association of accounting technicians (aat)"
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
                "AML-supervisory-bodies": "association of chartered certified accountants (acca)"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "association of chartered certified accountants (acca)"
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
                "AML-supervisory-bodies": "association of chartered certified accountants (acca)"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "association of chartered certified accountants (acca)"
        });

        const amlBody1: AmlSupervisoryBody = {
            amlSupervisoryBody: "HMRC",
            membershipId: "12345678"
        };
        const amlBody2: AmlSupervisoryBody = {
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
                "AML-supervisory-bodies": "association of chartered certified accountants (acca)",
                id: "12345678"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "association of chartered certified accountants (acca)",
            membershipId: "12345678"
        });

        const amlBody1: AmlSupervisoryBody = {
            amlSupervisoryBody: "association of chartered certified accountants (acca)",
            membershipId: "12345678"
        };
        const amlBody2: AmlSupervisoryBody = {
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
                amlSupervisoryBody: "association of chartered certified accountants (acca)",
                membershipId: "12345678"
            },
            {
                amlSupervisoryBody: "HMRC",
                membershipId: "12345678"
            }
        );

        const amlBody1: AmlSupervisoryBody = {
            amlSupervisoryBody: "association of chartered certified accountants (acca)",
            membershipId: "12345678"
        };
        const amlBody2: AmlSupervisoryBody = {
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
                "AML-supervisory-bodies": "association of chartered certified accountants (acca)"
            }
        };

        const amlSupervisoryBodiesExpected: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodiesExpected.push({
            amlSupervisoryBody: "association of chartered certified accountants (acca)"
        });

        const amlBody1: AmlSupervisoryBody = {
            amlSupervisoryBody: "association of chartered certified accountants (acca)"
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

});
