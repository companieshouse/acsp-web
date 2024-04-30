import mocks from "../../mocks/all_middleware_mock";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AML_SUPERVISOR_SELECTED } from "../../../main/common/__utils/constants";
import { AmlSupervisoryBodyService } from "../../../main/services/amlSupervisoryBody/amlBodyService";

describe("AmlSupervisoryBodyService", () => {
    it("should save selected AML supervisory bodies to session when more then one selection", () => {
        const sessionMock: Partial<Session> = {
            setExtraData: jest.fn()
        };

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": ["AML1", "AML2"]
            }
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(sessionMock as Session, requestMock as Request);

        expect(sessionMock.setExtraData).toHaveBeenCalledWith(AML_SUPERVISOR_SELECTED, ["AML1", "AML2"]);
    });

    it("should save selected AML supervisory body to session when only one is selected", () => {
        const sessionMock: Partial<Session> = {
            setExtraData: jest.fn()
        };

        const requestMock: Partial<Request> = {
            body: {
                "AML-supervisory-bodies": "AML1"
            }
        };

        const amlSupervisoryBodyService = new AmlSupervisoryBodyService();
        amlSupervisoryBodyService.saveSelectedAML(sessionMock as Session, requestMock as Request);

        expect(sessionMock.setExtraData).toHaveBeenCalledWith(AML_SUPERVISOR_SELECTED, ["AML1"]);
    });
});
