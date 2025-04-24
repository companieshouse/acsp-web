import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import { Request, Response, NextFunction } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import app from "../../../../src/app";
import { UPDATE_ADD_AML_SUPERVISOR, AML_MEMBERSHIP_NUMBER, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";
import { get } from "../../../../src/controllers/features/update-acsp/addAmlSupervisorController";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ADD_AML_BODY_UPDATE, NEW_AML_BODY } from "../../../../src/common/__utils/constants";

const router = supertest(app);

describe("GET" + UPDATE_ADD_AML_SUPERVISOR, () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    let session: Partial<Session>;

    beforeEach(() => {
        session = {
            getExtraData: jest.fn()
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

describe("POST" + UPDATE_ADD_AML_SUPERVISOR, () => {
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "ACCA" });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + AML_MEMBERSHIP_NUMBER + "?lang=en");
    });
    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ADD_AML_SUPERVISOR).send({ "AML-supervisory-bodies": "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the AML supervisory body you are registered with");
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
