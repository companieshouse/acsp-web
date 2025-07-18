import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import { Request, Response, NextFunction } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import app from "../../../../src/app";
import { UPDATE_ADD_AML_SUPERVISOR, AML_MEMBERSHIP_NUMBER, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";
import { get } from "../../../../src/controllers/features/update-acsp/addAmlSupervisorController";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ADD_AML_BODY_UPDATE, NEW_AML_BODY, SUBMISSION_ID } from "../../../../src/common/__utils/constants";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { create25AmlBodies, dummyFullProfile } from "../../../mocks/acsp_profile.mock";

const router = supertest(app);

describe("GET" + UPDATE_ADD_AML_SUPERVISOR, () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let session: Partial<Session>;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn(),
            deleteExtraData: jest.fn()
        };

        req = {
            session: session as Session,
            query: {}
        } as Partial<Request>;

        res = {
            render: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
    });
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Which Anti-Money Laundering (AML) supervisory bodies are you registered with?");
    });
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR + "?update=0");
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Which Anti-Money Laundering (AML) supervisory bodies are you registered with?");
    });
    it("should set amlBody if NEW_AML_BODY is present in session", async () => {
        const amlSupervisoryBody = "Some Supervisory Body";
        (session.getExtraData as jest.Mock).mockReturnValueOnce({ amlSupervisoryBody });

        await get(req as Request, res as Response, next as NextFunction);

        expect(session.getExtraData).toHaveBeenCalledWith(NEW_AML_BODY);
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
describe("addAmlSupervisorController - get", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let sessionMock: Partial<Session>;

    beforeEach(() => {
        sessionMock = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn(),
            deleteExtraData: jest.fn()
        };

        req = {
            session: sessionMock as Session,
            query: {}
        } as Partial<Request>;

        res = {
            render: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
    });

    it("should set amlBody to the supervisoryBody at updateBodyIndex when updateBodyIndex is defined", async () => {
        const acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123456", supervisoryBody: "Body A" },
                { membershipDetails: "654321", supervisoryBody: "Body B" }
            ]
        };
        const updateBodyIndex = 1;

        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
                if (key === ADD_AML_BODY_UPDATE) return updateBodyIndex;
            });
        await get(req as Request, res as Response, next);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            amlBody: "Body B"
        }));
    });

    it("should not set amlBody if updateBodyIndex is undefined", async () => {
        const acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123456", supervisoryBody: "Body A" },
                { membershipDetails: "654321", supervisoryBody: "Body B" }
            ]
        };
        const updateBodyIndex = undefined;
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
                if (key === ADD_AML_BODY_UPDATE) return updateBodyIndex;
            });
        await get(req as Request, res as Response, next);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            amlBody: ""
        }));
    });
});
describe("amlSupervisor", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
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
            }),
            setExtraData: jest.fn()
        } as Partial<Session>;

        req = {
            query: {},
            session: session as Session
        } as Partial<Request>;
        res = {
            render: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
    });
    it("should render the page with the correct AML supervisory body when amlUpdateIndex and amlUpdateBody are provided", () => {
        req.query = { amlindex: "456", amlbody: "body2" };
        get(req as Request, res as Response, next as NextFunction);
        expect(session.setExtraData).toHaveBeenCalledWith(ADD_AML_BODY_UPDATE, 1);

    });
});

let customMockSessionMiddleware: any;

describe("POST" + UPDATE_ADD_AML_SUPERVISOR, () => {
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en");
    });
    it("should set NEW_AML_BODY in session when amlDetails is missing", async () => {
        const amlSupervisoryBody = "new aml body";
        createMockSessionMiddleware();
        const session = getSessionRequestWithPermission();
        session.getExtraData = jest.fn().mockReturnValue(null);
        session.setExtraData = jest.fn();
        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.session = session;
            if (typeof next === "function") {
                next();
            }
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).use(customMockSessionMiddleware).send({ "AML-supervisory-bodies": amlSupervisoryBody });
        expect(session.setExtraData).toHaveBeenCalledWith(NEW_AML_BODY, { amlSupervisoryBody });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en");
    });
    it("should update NEW_AML_BODY in session when amlDetails.amlSupervisoryBody is different", async () => {
        const amlSupervisoryBody = "Updated Supervisory Body";
        createMockSessionMiddleware();
        const session = getSessionRequestWithPermission();
        session.getExtraData = jest.fn().mockReturnValue(null);
        session.setExtraData = jest.fn();
        customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.session = session;
            if (typeof next === "function") {
                next();
            }
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": amlSupervisoryBody });
        expect(session.setExtraData).toHaveBeenCalledWith(NEW_AML_BODY, { amlSupervisoryBody });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en");
    });
    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the AML supervisory body you are registered with");
    });

    // Test for over 25 aml bodies, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        createMockSessionMiddleware();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("You cannot add details for more than 26 AML registrations. Remove details for an existing registration before you add new AML details");
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile, amlDetails: create25AmlBodies() });
    session.setExtraData(SUBMISSION_ID, "transactionID");
    session.setExtraData(NEW_AML_BODY, "new aml body");
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
