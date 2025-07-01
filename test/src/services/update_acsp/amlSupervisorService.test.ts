import { amlSupervisor } from "../../../../src/services/update-acsp/amlSupervisorService";
import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, AML_REMOVED_BODY_DETAILS } from "../../../../src/common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

describe("amlSupervisor", () => {
    let req: Partial<Request>;
    let session: Partial<Session>;
    let acspFullProfile: AcspFullProfile;
    let acspUpdatedFullProfile: AcspFullProfile;

    beforeEach(() => {
        acspFullProfile = {
            amlDetails: [
                { membershipDetails: "123", supervisoryBody: "body1" },
                { membershipDetails: "456", supervisoryBody: "body2" }
            ]
        } as AcspFullProfile;

        acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123", supervisoryBody: "body1" },
                { membershipDetails: "456", supervisoryBody: "body2" }
            ]
        } as AcspFullProfile;

        session = {
            getExtraData: jest.fn((key: string) => {
                if (key === ACSP_DETAILS) return acspFullProfile;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
            })
        } as Partial<Session>;

        req = {
            query: {},
            session: session as Session
        } as Partial<Request>;
    });
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should remove AML detail if found in updated profile", () => {
        req.query = { amlindex: "123", amlbody: "body1" };

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(1);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("456");
    });

    it("should undo removal of AML detail if not found in updated profile but found in full profile", () => {
        const initialRemovedAMLDetails = [
            { membershipId: "123", amlSupervisoryBody: "body1", dateOfChange: "2025-04-01T00:00:00.000Z" },
            { membershipId: "789", amlSupervisoryBody: "body3", dateOfChange: "2025-05-01T00:00:00.000Z" }
        ];

        (session.getExtraData as jest.Mock).mockImplementation((key: string) => {
            switch (key) {
            case ACSP_DETAILS:
                return acspFullProfile;
            case ACSP_DETAILS_UPDATED:
                return acspUpdatedFullProfile;
            case AML_REMOVED_BODY_DETAILS:
                return initialRemovedAMLDetails;
            }
        });

        session.setExtraData = jest.fn();

        acspUpdatedFullProfile.amlDetails = [{ membershipDetails: "456", supervisoryBody: "body2" }];
        req.query = { amlindex: "123", amlbody: "body1" };

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(2);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("123");
        expect(acspUpdatedFullProfile.amlDetails[1].membershipDetails).toBe("456");

        const expectedUpdatedRemovedAMLDetails = [
            { membershipId: "789", amlSupervisoryBody: "body3", dateOfChange: "2025-05-01T00:00:00.000Z" }
        ];
        expect(session.setExtraData).toHaveBeenCalledWith(AML_REMOVED_BODY_DETAILS, expectedUpdatedRemovedAMLDetails);
    });

    it("should do nothing if amlindex or amlbody is not provided", () => {
        req.query = {};

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(2);
    });

    it("should do nothing if AML detail is not found in either profile", () => {
        req.query = { amlindex: "789", amlbody: "body3" };

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(2);
        expect(acspUpdatedFullProfile.amlDetails[0].membershipDetails).toBe("123");
        expect(acspUpdatedFullProfile.amlDetails[1].membershipDetails).toBe("456");
    });
    it("should remove the last AML detail if only one detail is present", () => {
        acspUpdatedFullProfile.amlDetails = [{ membershipDetails: "123", supervisoryBody: "body1" }];
        req.query = { amlindex: "123", amlbody: "body1" };

        amlSupervisor(req as Request);

        expect(acspUpdatedFullProfile.amlDetails).toHaveLength(0);
    });
});
