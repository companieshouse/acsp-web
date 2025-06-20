/* eslint-disable import/first */
jest.mock("../../../../src/services/acspProfileService");
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import { get } from "../../../../src/controllers/features/update-acsp/indexController";
import { Request, Response, NextFunction } from "express";
import { Session } from "@companieshouse/node-session-handler";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import * as localise from "../../../../src/utils/localise";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../../src/common/__utils/constants";
const router = supertest(app);

const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;

describe("GET indexController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let sessionMock: Partial<Session>;

    beforeEach(() => {
        sessionMock = {
            getExtraData: jest.fn(),
            setExtraData: jest.fn()
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

    it("should return status 200", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(200);
    });

    it("should not set ACSP_DETAILS_UPDATED in the session when updateFlag is true", async () => {
        const mockAcspDetails = { name: "Test ACSP", number: "12345", status: "active" };
        const mockUpdatedAcspDetails = { name: "Updated ACSP", number: "12345" };
        sessionMock = {
            getExtraData: jest.fn((key: string) => {
                if (key === ACSP_DETAILS) return mockAcspDetails;
                if (key === ACSP_DETAILS_UPDATED) return mockUpdatedAcspDetails;
            }),
            setExtraData: jest.fn()
        } as Partial<Session>;

        req.session = sessionMock as Session;

        const mockGetAcspFullProfile = jest.fn().mockResolvedValue(mockAcspDetails);
        jest.mock("../../../../src/services/acspProfileService", () => ({
            getAcspFullProfile: mockGetAcspFullProfile
        }));

        await get(req as Request, res as Response, next);
        expect(sessionMock.setExtraData).not.toHaveBeenCalledWith(ACSP_DETAILS_UPDATED, mockAcspDetails);
        expect(res.render).toHaveBeenCalled();
    });
});
describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
