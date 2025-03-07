import mocks from "../../../mocks/all_middleware_mock";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_APPLICATION_CONFIRMATION, UPDATE_CHECK_YOUR_UPDATES, UPDATE_PROVIDE_AML_DETAILS, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import supertest from "supertest";
import app from "../../../../src/app";
import * as localise from "../../../../src/utils/localise";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, SUBMISSION_ID } from "../../../../src/common/__utils/constants";
import { Request, Response, NextFunction } from "express";

const router = supertest(app);

jest.mock("../../../../src/services/transactions/transaction_service");

const mockPostTransaction = postTransaction as jest.Mock;

describe("GET " + UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, () => {
    it("should return status 200 and render the your details page if updates have been made", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Your Updates");
        expect(res.status).toBe(200);
    });

    it("should return status 500 after calling getAcspFullProfile endpoint and failing", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, () => {
    it("should return status 302 after redirect to confirmation page", async () => {
        await mockPostTransaction.mockResolvedValueOnce({ id: "12345" });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES).send({ moreUpdates: "no" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 302 after redirect to update details page", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES).send({ moreUpdates: "yes" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 400 if no radio is selected", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES).send({ moreUpdates: "" });
        expect(res.status).toBe(400);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Select yes if you need to tell us about other updates");
    });

    it("should return status 500 after calling getAcspFullProfile endpoint and failing", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

let customMockSessionMiddleware : any;

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES, () => {
    it("should return status 302 after redirect to Provide AML page", async () => {
        createMockSessionMiddlewareAcspFullProfile();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CHECK_YOUR_UPDATES).send({ moreUpdates: "no" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_PROVIDE_AML_DETAILS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
    });
});

function createMockSessionMiddlewareAcspFullProfile () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS, dummyFullProfile);
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile, amlDetails: [] });
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
