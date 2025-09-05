/* eslint-disable import/first */
jest.mock("@companieshouse/api-sdk-node");
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import { Session } from "@companieshouse/node-session-handler";
import { get } from "../../../../src/controllers/features/update-acsp/whereDoYouLiveController";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_DATE_OF_THE_CHANGE, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_WHERE_DO_YOU_LIVE } from "../../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED, REQ_TYPE_UPDATE_ACSP } from "../../../../src/common/__utils/constants";
import { WhereDoYouLiveBodyService } from "../../../../src/services/where-do-you-live/whereDoYouLive";
import { mockSoleTraderAcspFullProfile } from "../../../mocks/update_your_details.mock";
import * as localise from "../../../../src/utils/localise";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { Request, Response, NextFunction } from "express";
import { isUpdateAcspRequest } from "../../../../src/validation/whereDoYouLive";

jest.mock("../../../../src/services/update-acsp/updateYourDetailsService");
jest.mock("../../../../src/services/where-do-you-live/whereDoYouLive");

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
    it("should return status 200", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ACSP_DETAILS, mockSoleTraderAcspFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Where do you live?");
    });
    it("should populate payload using getCountryPayloadFromCountryName when updateInProgress matches a country in countryList", async () => {
        const mockUpdateInProgress = "France";
        const mockPayload = { whereDoYouLiveRadio: "countryOutsideUK", countryInput: "France" };

        (req.session!.getExtraData as jest.Mock).mockReturnValueOnce(mockUpdateInProgress);
        (WhereDoYouLiveBodyService.prototype.getCountryPayloadFromCountryName as jest.Mock).mockReturnValue(mockPayload);
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        expect(WhereDoYouLiveBodyService.prototype.getCountryPayloadFromCountryName).toHaveBeenCalledWith(mockUpdateInProgress);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: mockPayload
        }));
    });

    it("should populate payload using getCountryPayloadFromCountryName when updateInProgress matches a UK country", async () => {
        const mockUpdateInProgress = "England";
        const mockPayload = { whereDoYouLiveRadio: "England" };

        (req.session!.getExtraData as jest.Mock).mockReturnValueOnce(mockUpdateInProgress);
        (WhereDoYouLiveBodyService.prototype.getCountryPayloadFromCountryName as jest.Mock).mockReturnValue(mockPayload);
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATE_IN_PROGRESS);
        expect(WhereDoYouLiveBodyService.prototype.getCountryPayloadFromCountryName).toHaveBeenCalledWith(mockUpdateInProgress);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: mockPayload
        }));
    });
    it("should set payload using getCountryPayload when ACSP_DETAILS_UPDATED exists", async () => {
        const mockAcspData = {
            applicantDetails: {
                countryOfResidence: "France"
            }
        };
        const mockPayload = { whereDoYouLiveRadio: "France" };
        (req.session!.getExtraData as jest.Mock).mockImplementation((key: string) => {
            if (key === ACSP_DETAILS_UPDATED) {
                return mockAcspData;
            }
            return null;
        });
        (WhereDoYouLiveBodyService.prototype.getCountryPayload as jest.Mock).mockReturnValue(mockPayload);
        await get(req as Request, res as Response, next);
        expect(req.session!.getExtraData).toHaveBeenCalledWith(ACSP_DETAILS_UPDATED);
        expect(WhereDoYouLiveBodyService.prototype.getCountryPayload).toHaveBeenCalledWith(mockAcspData);
        expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            payload: mockPayload
        }));
    });
    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST" + UPDATE_WHERE_DO_YOU_LIVE, () => {
    it("should return status 302 after redirect", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(ACSP_DETAILS, {});
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "Wales" });
        expect(res.status).toBe(302);
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE + "?lang=en");

    });

    // Test for invalid input
    it("should return status 400 for invalid countryInput", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "countryOutsideUK", countryInput: "invalidCountry" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for invalid input
    it("should return status 400 for empty countryInput", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "countryOutsideUK", countryInput: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for empty input
    it("should handle countryInput for empty whereDoYouLiveRadio", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "", countryInput: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    // Test for empty input
    it("should handle countryInput for users outside the UK", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "", countryInput: "Canada" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select where you live");
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should return status 400 when inputted country matches existing country", async () => {
        createMockSessionMiddlewareAcspFullProfile();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "United  Kingdom" });

        expect(res.status).toBe(400);
        expect(res.text).toContain("Select to update where you live if it’s changed or cancel the update");

    });

    it("should return status 400 when inputted country matches existing country ignoring case and spaces", async () => {
        createMockSessionMiddlewareAcspFullProfile();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHERE_DO_YOU_LIVE)
            .send({ whereDoYouLiveRadio: "countryOutsideUK", countryInput: "united  kingdom" });

        expect(res.status).toBe(400);
        expect(res.text).toContain("Select to update where you live if it’s changed or cancel the update");
    });
});

describe("isUpdateAcspRequest", () => {
    it("should return true when reqType is REQ_TYPE_UPDATE_ACSP", () => {
        const mockReq = {
            res: {
                locals: {
                    reqType: REQ_TYPE_UPDATE_ACSP
                }
            }
        };

        const result = isUpdateAcspRequest(mockReq);
        expect(result).toBe(true);
    });

    it("should return false when reqType is not REQ_TYPE_UPDATE_ACSP", () => {
        const mockReq = {
            res: {
                locals: {
                    reqType: "OTHER_REQ_TYPE"
                }
            }
        };

        const result = isUpdateAcspRequest(mockReq);
        expect(result).toBe(false);
    });

    it("should return false when reqType is undefined)", () => {
        const mockReq = {
            res: {
                locals: {}
            }
        };

        const result = isUpdateAcspRequest(mockReq);
        expect(result).toBe(false);
    });
});

function createMockSessionMiddlewareAcspFullProfile () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS, { ...dummyFullProfile, soleTraderDetails: { usualResidentialCountry: "United  Kingdom" } });
    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
