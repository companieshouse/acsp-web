import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AML_SUPERVISOR_SELECTED } from "../../../src/common/__utils/constants";
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

        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = [];
        amlSupervisoryBodies.push({
            amlSupervisoryBody: "Association of Chartered Certified Accountants (ACCA)"
        });

        const acspData: AcspData = {
            id: "abc",
            typeOfBusiness: "LIMITED"
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(requestMock as Request, acspData as AcspData);
        expect(acspData.amlSupervisoryBodies).toEqual(amlSupervisoryBodies);
    });
});
