import { createRequest, MockRequest } from "node-mocks-http";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import * as localise from "../../../../src/utils/localise";
import * as dateOfTheChangeService from "../../../../src/services/update-acsp/dateOfTheChangeService";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { buildDatePayload, get } from "../../../../src/controllers/features/update-acsp/dateOfTheChangeController";
import { Request, Response, NextFunction } from "express";
import { AML_MEMBERSHIP_NUMBER, REMOVE_AML_SUPERVISOR, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CHECK_YOUR_UPDATES, UPDATE_DATE_OF_THE_CHANGE } from "../../../../src/types/pageURL";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_DETAILS_UPDATED, ADD_AML_BODY_UPDATE, AML_REMOVAL_BODY, AML_REMOVAL_INDEX, AML_REMOVED_BODY_DETAILS, NEW_AML_BODY } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { updateWithTheEffectiveDateAmendment } from "../../../../src/services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
jest.mock("../../../../src/services/update-acsp/dateOfTheChangeService");

const router = supertest(app);

let customMockSessionMiddleware : any;

describe("GET " + UPDATE_DATE_OF_THE_CHANGE, () => {
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
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should respond with status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE);
        expect(res.text).toContain("When did this change?");
        expect(res.text).toContain("For example, 27 1 2022");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
    });
    it("should set dateOfChange from removedAMLData when undoing AML removal", async () => {
        const removedAMLData = [
            { amlSupervisoryBody: "Body A", membershipId: "123456", dateOfChange: "2023-12-12" },
            { amlSupervisoryBody: "Body B", membershipId: "654321", dateOfChange: "2024-01-01" }
        ];
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATED) return { amlDetails: [] };
                if (key === AML_REMOVAL_INDEX) return "654321";
                if (key === AML_REMOVAL_BODY) return "Body B";
                if (key === AML_REMOVED_BODY_DETAILS) return removedAMLData;
                return undefined;
            });

        await get(req as Request, res as Response, next);

        expect(res.render).toHaveBeenCalledWith(
            "../views/features/update-acsp-details/date-of-the-change/date-of-the-change",
            expect.objectContaining({
                payload: {
                    "change-year": 2024,
                    "change-month": 1,
                    "change-day": 1
                }
            })
        );
    });
    it("should set ADD_AML_BODY_UPDATE to the last index of amlDetails when NEW_AML_BODY is not present and previousPage includes AML_MEMBERSHIP_NUMBER", async () => {
        const acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123456", supervisoryBody: "Body A" },
                { membershipDetails: "654321", supervisoryBody: "Body B" }
            ]
        };

        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === NEW_AML_BODY) return undefined;
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
                if (key === ADD_AML_BODY_UPDATE) return undefined;
            });
        const previousPage = AML_MEMBERSHIP_NUMBER;
        jest.spyOn(localise, "addLangToUrl").mockReturnValue(previousPage);
        req.query = { lang: "en" };
        await get(req as Request, res as Response, next);
        expect(sessionMock.setExtraData).toHaveBeenCalledWith(ADD_AML_BODY_UPDATE, acspUpdatedFullProfile.amlDetails.length - 1);
    });

    it("should not set ADD_AML_BODY_UPDATE if NEW_AML_BODY is present", async () => {
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === NEW_AML_BODY) return { amlSupervisoryBody: "Body A" };
            });
        req.query = { lang: "en" };
        await get(req as Request, res as Response, next);
        expect(sessionMock.setExtraData).not.toHaveBeenCalledWith(ADD_AML_BODY_UPDATE, expect.anything());
    });

    it("should not set ADD_AML_BODY_UPDATE if previousPage does not include AML_MEMBERSHIP_NUMBER", async () => {
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === NEW_AML_BODY) return undefined;
                if (key === ACSP_DETAILS_UPDATED) return { amlDetails: [] };
            });
        const previousPage = "randomPage";
        jest.spyOn(localise, "addLangToUrl").mockReturnValue(previousPage);
        req.query = { lang: "en" };
        await get(req as Request, res as Response, next);
        expect(sessionMock.setExtraData).not.toHaveBeenCalledWith(ADD_AML_BODY_UPDATE, expect.anything());
    });

    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should set AML_REMOVAL_INDEX and AML_REMOVAL_BODY if query params are present", async () => {
        const amlRemovalIndex = "123456";
        const amlRemovalBody = "supervisory-body";

        req.query = {
            amlindex: amlRemovalIndex,
            amlbody: amlRemovalBody
        };

        await get(req as Request, res as Response, next);

        expect(sessionMock.setExtraData).toHaveBeenCalledWith(AML_REMOVAL_INDEX, amlRemovalIndex);
        expect(sessionMock.setExtraData).toHaveBeenCalledWith(AML_REMOVAL_BODY, amlRemovalBody);
    });
    it("should use dateOfChange from amlDetails when newAmlBody and updateBodyIndex are present", async () => {
        const acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123456", supervisoryBody: "Body A", dateOfChange: "2024-01-01" }
            ]
        };
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
                if (key === NEW_AML_BODY) return { membershipId: "123456", amlSupervisoryBody: "Body A" };
                if (key === ADD_AML_BODY_UPDATE) return 0;
                return undefined;
            });
        const previousPage = "/update-acsp-details/aml-membership-number";
        jest.spyOn(require("../../../../src/utils/localise"), "addLangToUrl").mockReturnValue(previousPage);

        await get(req as Request, res as Response, next);

        expect(res.render).toHaveBeenCalledWith(
            "../views/features/update-acsp-details/date-of-the-change/date-of-the-change",
            expect.objectContaining({
                payload: {
                    "change-year": 2024,
                    "change-month": 1,
                    "change-day": 1
                }
            })
        );
    });

    it("should set NEW_AML_BODY and payload when newAmlBody is not present and previousPage includes AML_MEMBERSHIP_NUMBER", async () => {
        const acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123456", supervisoryBody: "Body A", dateOfChange: "2024-02-02" }
            ]
        };
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATED) return acspUpdatedFullProfile;
                if (key === NEW_AML_BODY) return undefined;
                if (key === ADD_AML_BODY_UPDATE) return undefined;
                return undefined;
            });
        const previousPage = "/update-acsp-details/aml-membership-number";
        jest.spyOn(require("../../../../src/utils/localise"), "addLangToUrl").mockReturnValue(previousPage);

        await get(req as Request, res as Response, next);
        expect(sessionMock.setExtraData).toHaveBeenNthCalledWith(1, ADD_AML_BODY_UPDATE, 0);
        expect(sessionMock.setExtraData).toHaveBeenNthCalledWith(2, NEW_AML_BODY, {
            amlSupervisoryBody: "Body A",
            membershipId: "123456",
            dateOfChange: "2024-02-02"
        });

        expect(res.render).toHaveBeenCalledWith(
            "../views/features/update-acsp-details/date-of-the-change/date-of-the-change",
            expect.objectContaining({
                payload: {
                    "change-year": 2024,
                    "change-month": 2,
                    "change-day": 2
                }
            })
        );
    });
    it("should set NEW_AML_BODY to the last index of amlDetails", async () => {
        const acspUpdatedFullProfile = {
            amlDetails: [
                { membershipDetails: "123456", supervisoryBody: "Body A" },
                { membershipDetails: "654321", supervisoryBody: "Body B" }
            ]
        };
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === NEW_AML_BODY) return undefined;
                if (key === ADD_AML_BODY_UPDATE) return acspUpdatedFullProfile.amlDetails.length - 1;
            });
        const previousPage = AML_MEMBERSHIP_NUMBER;
        jest.spyOn(localise, "addLangToUrl").mockReturnValue(previousPage);
        req.query = { lang: "en" };
        await get(req as Request, res as Response, next);
        expect(sessionMock.setExtraData).not.toHaveBeenCalledWith(ADD_AML_BODY_UPDATE, expect.anything());
    });

    it("should call getDateOfChangeFromSession when updateInProgress is true", async () => {
        sessionMock.getExtraData = jest.fn()
            .mockImplementation((key: string) => {
                if (key === ACSP_DETAILS_UPDATE_IN_PROGRESS) return true;
                if (key === ACSP_DETAILS_UPDATED) return { amlDetails: [] };
                return undefined;
            });

        const previousPage = "somePreviousPage";
        jest.spyOn(dateOfTheChangeService, "getDateOfChangeFromSession").mockReturnValue("2024-01-01");
        jest.spyOn(dateOfTheChangeService, "setUpdateInProgressAndGetDateOfChange").mockReturnValue(undefined);

        jest.spyOn(require("../../../../src/utils/localise"), "addLangToUrl").mockReturnValue(previousPage);

        req.session = sessionMock as Session;

        await get(req as Request, res as Response, next);

        expect(dateOfTheChangeService.getDateOfChangeFromSession).toHaveBeenCalledWith(previousPage, sessionMock);
        expect(res.render).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                payload: { "change-year": 2024, "change-month": 1, "change-day": 1 }
            })
        );
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
    });
    it("should return status 400 after no date address entered", async () => {
        req.body = {
            "change-day": "",
            "change-month": "",
            "change-year": ""
        };
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE).send(req.body);
        expect(res.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Enter the date when change happened");
    });
    it("should call updateWithTheEffectiveDateAmendment and redirect if validation passes", async () => {
        req.body = {
            "change-day": "01",
            "change-month": "01",
            "change-year": "2025"
        };
        createMockSessionMiddlewareAcspFullProfile();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE).send(req.body);
        expect(res.status).toBe(302);
        expect(updateWithTheEffectiveDateAmendment).toHaveBeenCalledTimes(1);
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should update removedAMLDetails with amlSupervisoryBody, membershipId, and dateOfChange, and save it into the session", async () => {
        const amlRemovalIndex = "123456";
        const amlRemovalBody = "supervisory-body";
        const dateOfChange = new Date("2025-01-01T00:00:00.000Z").toISOString();

        req.body = {
            "change-day": "01",
            "change-month": "01",
            "change-year": "2025"
        };
        const session = createMockSessionMiddlewareRemoveAmlDetails();
        session.setExtraData = jest.fn();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE).send(req.body);
        const expectedUpdatedRemovedAMLDetails = [
            {
                amlSupervisoryBody: amlRemovalBody,
                membershipId: amlRemovalIndex,
                dateOfChange: dateOfChange
            }
        ];
        expect(session.setExtraData).toHaveBeenCalledWith(AML_REMOVED_BODY_DETAILS, expectedUpdatedRemovedAMLDetails);
        expect(res.status).toBe(302); // Ensure the controller redirects
        expect(res.header.location).toContain(REMOVE_AML_SUPERVISOR); // Ensure redirect URL is correct
    });

    it("should redirect to Your Updates page if query param your-updates is present", async () => {
        req.body = {
            "change-day": "01",
            "change-month": "01",
            "change-year": "2025"
        };
        createMockSessionMiddlewareRemoveAmlDetails();
        req.query = { return: "your-updates" };

        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE + "?return=your-updates").send(req.body);
        expect(res.status).toBe(302);
        expect(res.header.location).toContain(UPDATE_CHECK_YOUR_UPDATES);
    });
});

describe("buildDatePayload", () => {
    it("should return correct payload for a valid date", () => {
        const result = buildDatePayload("2024-12-05");
        expect(result).toEqual({
            "change-year": 2024,
            "change-month": 12,
            "change-day": 5
        });
    });

    it("should return an empty object if date is undefined", () => {
        const result = buildDatePayload(undefined as any);
        expect(result).toEqual({});
    });
});

function createMockSessionMiddlewareAcspFullProfile () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, { dummyFullProfile });
    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}

function createMockSessionMiddlewareRemoveAmlDetails (): Partial<Session> {
    const amlRemovalIndex = "123456";
    const amlRemovalBody = "supervisory-body";
    const existingRemovedAMLDetails: AmlSupervisoryBody[] = [];

    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(AML_REMOVAL_INDEX, amlRemovalIndex);
    session.setExtraData(AML_REMOVAL_BODY, amlRemovalBody);
    session.setExtraData(AML_REMOVED_BODY_DETAILS, existingRemovedAMLDetails);

    customMockSessionMiddleware.mockImplementation((req: Request, _res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });

    return session;
}
