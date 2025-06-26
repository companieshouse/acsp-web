/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import { Session } from "@companieshouse/node-session-handler";
import { get } from "../../../../src/controllers/features/update-acsp/whatIsYourNameController";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_DATE_OF_THE_CHANGE, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../../../src/common/__utils/constants";
import { mockSoleTraderAcspFullProfile } from "../../../mocks/update_your_details.mock";
import * as localise from "../../../../src/utils/localise";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { Request, Response, NextFunction } from "express";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/update-acsp/updateYourDetailsService");

const router = supertest(app);

let customMockSessionMiddleware : any;

describe("GET" + UPDATE_ACSP_WHAT_IS_YOUR_NAME, () => {
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
        };

        next = jest.fn();

        jest.clearAllMocks();
    });
    const session = getSessionRequestWithPermission();
    it("should return status 200", async () => {
        session.setExtraData(ACSP_DETAILS_UPDATED, mockSoleTraderAcspFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is your name?");
    });
    it("should populate payload when ACSP_DETAILS_UPDATE_IN_PROGRESS exists", async () => {
        const mockUpdateInProgressDetails = {
            forename: "John",
            otherForenames: "Michael",
            surname: "Doe"
        };

        const mockAcspUpdatedFullProfile = {
            soleTraderDetails: {
                forename: "Jane",
                otherForenames: "Elizabeth",
                surname: "Smith"
            }
        };

        (req.session!.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) {
                    return mockUpdateInProgressDetails;
                }
                if (key === ACSP_DETAILS_UPDATED) {
                    return mockAcspUpdatedFullProfile;
                }
                return null;
            });
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                "first-name": "John",
                "middle-names": "Michael",
                "last-name": "Doe"
            }
        }));
    });

    it("should populate payload using acspUpdatedFullProfile when ACSP_DETAILS_UPDATE_IN_PROGRESS does not exist", async () => {
        const mockAcspUpdatedFullProfile = {
            soleTraderDetails: {
                forename: "Jane",
                otherForenames: "Elizabeth",
                surname: "Smith"
            }
        };

        (req.session!.getExtraData as jest.Mock)
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) {
                    return null;
                }
                if (key === ACSP_DETAILS_UPDATED) {
                    return mockAcspUpdatedFullProfile;
                }
                return null;
            });
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: {
                "first-name": "Jane",
                "middle-names": "Elizabeth",
                "last-name": "Smith"
            }
        }));
    });
    it("Should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_ACSP_WHAT_IS_YOUR_NAME, () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME)
            .send({
                "first-name": "John",
                "middle-names": "",
                "last-name": "Doe"
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(400);
    });

    // Test for the same name entered, will return 400.
    it("should return status 400 when the same name is entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME)
            .send({
                "first-name": "John",
                "middle-names": "A",
                "last-name": "Doe"
            }); ;
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update your first name if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update your middle names if they’ve changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update your last name if it’s changed or cancel the update if you do not need to make any changes");
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    // Test for the same name entered, will return 400.
    it("should return status 400 when the same name is entered with no middlename", async () => {
        createMockSessionMiddlewareAcspFullProfile();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME)
            .send({
                "first-name": "John",
                "middle-names": "",
                "last-name": "Doe"
            }); ;
        expect(res.status).toBe(400);
        expect(res.text).toContain("Update your first name if it’s changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update your middle names if they’ve changed or cancel the update if you do not need to make any changes");
        expect(res.text).toContain("Update your last name if it’s changed or cancel the update if you do not need to make any changes");
    });
});

function createMockSessionMiddlewareAcspFullProfile () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS, { ...dummyFullProfile, soleTraderDetails: { forename: "John", surname: "Doe" } });
    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
