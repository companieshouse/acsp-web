import { Request, Response, NextFunction } from "express";
import { Session } from "@companieshouse/node-session-handler";
import mocks from "../../../mocks/all_middleware_mock";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { AML_MEMBERSHIP_NUMBER, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE } from "../../../../src/types/pageURL";
import { ACSP_DETAILS_UPDATED, NEW_AML_BODY, ADD_AML_BODY_UPDATE, AML_REMOVED_BODY_DETAILS } from "../../../../src/common/__utils/constants";
import * as localise from "../../../../src/utils/localise";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { get } from "../../../../src/controllers/features/update-acsp/amlMembershipNumberController";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";

jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + AML_MEMBERSHIP_NUMBER, () => {
    it("should render the AML membership number page with status 200", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "Some Body" });
        session.setExtraData(ACSP_DETAILS_UPDATED, { amlDetails: [] });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
        expect(res.text).toContain("What is the Anti-Money Laundering (AML) membership number?");
    });

    it("should render the AML membership number page with pre-filled membership number when updateBodyIndex is set", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "Some Body" });
        session.setExtraData(ADD_AML_BODY_UPDATE, 0);
        session.setExtraData(ACSP_DETAILS_UPDATED, { amlDetails: [{ membershipDetails: "123456" }] });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
    });

    it("should return status 500 if an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("amlMembershipNumberController", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let session: Session;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        next = jest.fn() as NextFunction;
        session = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
        } as any as Session;
        req.session = session;
    });

    it("should set payload with membershipNumber_1 if updateBodyIndex is provided", async () => {
        const updateBodyIndex = 1;
        const acspUpdatedFullProfile: AcspFullProfile = {
            amlDetails: [
                { supervisoryBody: "Old Supervisory Body", membershipDetails: "Old Membership ID" },
                { supervisoryBody: "Old Supervisory Body", membershipDetails: "New Membership ID" }
            ]
        } as AcspFullProfile;

        session.getExtraData = jest.fn().mockReturnValueOnce(acspUpdatedFullProfile).mockReturnValueOnce(updateBodyIndex);
        req.query = { update: updateBodyIndex.toString() };

        let payload;
        if (updateBodyIndex) {
            payload = { membershipNumber_1: acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails };
        }

        await get(req, res, next);

        expect(payload).toEqual({ membershipNumber_1: "New Membership ID" });
    });
    it("should set payload with membershipNumber_1 if newAMLBody.membershipId is provided", async () => {
        const newAMLBody = { membershipId: "123456" };
        const acspUpdatedFullProfile: AcspFullProfile = {
            amlDetails: [
                { supervisoryBody: "Old Supervisory Body", membershipDetails: "Old Membership ID" }
            ]
        } as AcspFullProfile;

        session.getExtraData = jest.fn()
            .mockReturnValueOnce(newAMLBody)
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce(acspUpdatedFullProfile);

        let payload;
        if (newAMLBody.membershipId) {
            payload = { membershipNumber_1: newAMLBody.membershipId };
        }

        await get(req, res, next);

        expect(payload).toEqual({ membershipNumber_1: "123456" });
    });
    it("should not set payload if updateBodyIndex is not provided", async () => {
        const updateBodyIndex = undefined;
        const acspUpdatedFullProfile: AcspFullProfile = {
            amlDetails: [
                { supervisoryBody: "Old Supervisory Body", membershipDetails: "Old Membership ID" }
            ]
        } as AcspFullProfile;

        session.getExtraData = jest.fn().mockReturnValueOnce(acspUpdatedFullProfile).mockReturnValueOnce(updateBodyIndex);
        req.query = { update: updateBodyIndex };

        let payload;
        if (updateBodyIndex) {
            payload = { membershipNumber_1: acspUpdatedFullProfile.amlDetails[updateBodyIndex].membershipDetails };
        }

        await get(req, res, next);

        expect(payload).toBeUndefined();
    });
});

let customMockSessionMiddleware: any;

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER, () => {
    it("should return status 302 after redirect for valid input, ", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE + "?lang=en");
    });

    it("should return status 400 for invalid input, empty value", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: " " });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.text).toContain("Enter the details for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 400 for invalid input, value is more than 256 characters", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en").send({ membershipNumber_1: "yHwml8BPxLQ5LoQeH5ScYkEEHe00NBIZO1j13EbozE9O7i2HJcTgKH4F97if95K6kptRglWGmzidTDTlRJAQcvx266KlEGtOQk8PTQ902oUpo0CxLDOBz7gQksTRKXLhYOB6cGgVikR7OARmY5n5xcGFbsNXyb26VzOz5HRCqs4lbGuWzw3Jmlf9R4y9NCAUttTic2YUCYvCijoibqtiHL5ZZr096PBmOIIUf9tYbpoXU5PE1N2eRTIO8xzLIUDZo" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.text).toContain("The Anti-Money Laundering (AML) membership number must be 256 characters or less for Association of Chartered Certified Accountants (ACCA)");
    });

    it("should return status 400 for invalid input, duplicate AML details", async () => {
        createMockSessionMiddleware();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER)
            .send({ membershipNumber_1: "123456789" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.text).toContain("The membership number you entered has already been added for this AML supervisory body. Enter a different membership number");
    });

    it("should return status 400 for duplicate AML when not editing an existing AML (updateBodyIndex is undefined)", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ADD_AML_BODY_UPDATE, undefined);
        session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "hm-revenue-customs-hmrc" });
        session.setExtraData(ACSP_DETAILS_UPDATED, {
            amlDetails: [{
                supervisoryBody: "hm-revenue-customs-hmrc",
                membershipDetails: "123456"
            }]
        });

        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.session = session;
            next();
        });

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });

        expect(res.status).toBe(400);
        expect(res.text).toContain("The membership number you entered has already been added for this AML supervisory body");
    });

    it("should return status 400 for duplicate AML when editing a different AML (index !== updateBodyIndex)", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ADD_AML_BODY_UPDATE, 1);
        session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "hm-revenue-customs-hmrc" });
        session.setExtraData(ACSP_DETAILS_UPDATED, {
            amlDetails: [
                {
                    supervisoryBody: "hm-revenue-customs-hmrc",
                    membershipDetails: "123456"
                },
                {
                    supervisoryBody: "hm-revenue-customs-hmrc",
                    membershipDetails: "789012"
                }
            ]
        });
        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.session = session;
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });

        expect(res.status).toBe(400);
        expect(res.text).toContain("The membership number you entered has already been added for this AML supervisory body");
    });

    it("should return status 400 if user attempts to re-add a previously removed AML", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ADD_AML_BODY_UPDATE, undefined);
        session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "hm-revenue-customs-hmrc" });
        session.setExtraData(ACSP_DETAILS_UPDATED, {
            amlDetails: []
        });
        session.setExtraData(AML_REMOVED_BODY_DETAILS, [
            {
                amlSupervisoryBody: "hm-revenue-customs-hmrc",
                membershipId: "123456"
            }
        ]);

        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.session = session;
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });

        expect(res.status).toBe(400);
        expect(res.text).toContain("The membership number you entered has already been added for this AML supervisory body");
    });

    it("should return status 500 after calling POST endpoint and failing", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_1: "123456" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(NEW_AML_BODY, { amlSupervisoryBody: "hm-revenue-customs-hmrc" });
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile });
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
