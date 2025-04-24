import { createRequest, MockRequest } from "node-mocks-http";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import * as localise from "../../../../src/utils/localise";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";

import { Request, Response, NextFunction } from "express";
import { REMOVE_AML_SUPERVISOR, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_DATE_OF_THE_CHANGE } from "../../../../src/types/pageURL";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, AML_REMOVAL_BODY, AML_REMOVAL_INDEX, AML_REMOVED_BODY_DETAILS } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { updateWithTheEffectiveDateAmendment } from "../../../../src/services/update-acsp/dateOfTheChangeService";
import { Session } from "@companieshouse/node-session-handler";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
jest.mock("../../../../src/services/update-acsp/dateOfTheChangeService");

const router = supertest(app);

let customMockSessionMiddleware : any;

describe("GET " + UPDATE_DATE_OF_THE_CHANGE, () => {
    it("should respond with status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_DATE_OF_THE_CHANGE);
        expect(res.text).toContain("When did this change?");
        expect(res.text).toContain("For example, 27 1 2022");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
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
