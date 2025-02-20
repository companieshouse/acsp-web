import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { MANAGE_USERS_DASHBOARD, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CANCEL_ALL_UPDATES } from "../../../../src/types/pageURL";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response, NextFunction } from "express";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { ACSP_DETAILS_UPDATED } from "../../../../src/common/__utils/constants";
import { createRequest, MockRequest } from "node-mocks-http";

const router = supertest(app);

let customMockSessionMiddleware : any;

describe("GET " + UPDATE_CANCEL_ALL_UPDATES, () => {
    it("should respond with status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES);
        expect(res.text).toContain("Are you sure you want to cancel all updates?");
        expect(res.text).toContain("If you continue, we’ll return you to the authorised agent account.");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {

    let req: MockRequest<Request>;
    beforeEach(() => {
        jest.clearAllMocks();
        req = createRequest({
            method: "POST",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
    });

    it("should return status 500 if deleteExtraData throws an error", async () => {
        mocks.mockSessionMiddleware.mockImplementation((req, res, next) => {
            req.session = {
                deleteExtraData: jest.fn().mockImplementation(() => {
                    throw new Error();
                })
            } as unknown as Session;
            next();
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should delete ACSP_DETAILS_UPDATED from session if acspUpdatedFullProfile exists", async () => {
        const session: Session = req.session as any as Session;
        createMockSessionMiddlewareAcspFullProfile();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(session.getExtraData(ACSP_DETAILS_UPDATED)).toBe(undefined);
    });

    it("should redirect to manage users dashboard", async () => {
        const manageUsersDashboard = MANAGE_USERS_DASHBOARD;
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CANCEL_ALL_UPDATES);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(manageUsersDashboard);
    });

});

function createMockSessionMiddlewareAcspFullProfile () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS_UPDATED, { dummyFullProfile });
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
