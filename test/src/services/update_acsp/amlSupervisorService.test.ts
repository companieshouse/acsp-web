import { createRequest, MockRequest } from "node-mocks-http";
import { amlSupervisor } from "../../../../src/services/update-acsp/amlSupervisorService";
import { Request } from "express";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, NEW_AML_BODIES } from "../../../../src/common/__utils/constants";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

describe("amlSupervisor", () => {
    let req: MockRequest<Request>;
    let session: Partial<Session>;
    let acspFullProfile: AcspFullProfile;
    let acspUpdatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/"
        });
        req.session = getSessionRequestWithPermission();
        acspFullProfile = {
            amlDetails: [
                { membershipDetails: "123" },
                { membershipDetails: "456" }
            ]
        } as AcspFullProfile;

        acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123" },
                { membershipDetails: "456" }
            ]
        } as AcspFullProfile;

        session = {
            getExtraData: jest.fn((key: string) => {
                if (key === ACSP_DETAILS) return acspFullProfile;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
            })
        } as Partial<Session>;

        req.session = session as Session;
    });

    it("should remove AML detail if index is found in updated profile", () => {
        req.query.amlindex = "123";

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(1);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("456");
    });

    it("should clear AML details if only one detail is present and index is found", () => {
        acspUpdatedFullProfile.amlDetails = [{ membershipDetails: "123", supervisoryBody: "SomeBody" }];
        req.query.amlindex = "123";

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(0);
    });

    it("should undo removal of AML detail if index is not found in updated profile but found in original profile", () => {
        acspUpdatedFullProfile.amlDetails = [{ membershipDetails: "456", supervisoryBody: "SomeBody" }];
        req.query.amlindex = "123";

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(2);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("123");
        expect(acspUpdatedFullProfile.amlDetails[1].membershipDetails).toBe("456");
    });

    it("should do nothing if amlindex is not provided", () => {
        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(2);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("123");
        expect(acspUpdatedFullProfile.amlDetails[1].membershipDetails).toBe("456");
    });

    it("should do nothing if amlindex is not found in both profiles", () => {
        req.query.amlindex = "789";

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(2);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("123");
        expect(acspUpdatedFullProfile.amlDetails[1].membershipDetails).toBe("456");
    });
});
