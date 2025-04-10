import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as localise from "../../../../src/utils/localise";
import { CANCEL_AN_UPDATE, UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, UPDATE_CORRESPONDENCE_ADDRESS_LIST, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import { sessionMiddleware } from "../../../../src/middleware/session_middleware";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS_UPDATED, ADDRESS_LIST, SUBMISSION_ID } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import { Request, Response, NextFunction } from "express";
import { addressList } from "../../../mocks/address.mock";

const router = supertest(app);

describe("GET" + UPDATE_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Select the correspondence address");
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("GET " + UPDATE_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should redirect to the correct URL when cancelling update as sole trader", async () => {
        createMockSessionMiddleware();
        const response = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + CANCEL_AN_UPDATE);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
    });
});

describe("POST" + UPDATE_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should redirect to next page with status 302", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });

    it("should return status 400 after no data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "" });
        expect(res.status).toBe(400);
        expect(res.text).toContain("Select the correspondence address");
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

let customMockSessionMiddleware: any;

describe("POST" + UPDATE_CORRESPONDENCE_ADDRESS_LIST, () => {
    it("should redirect to next page with status 302 with sole-trader type", async () => {
        createMockSessionMiddleware();
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_LIST).send({ correspondenceAddress: "1" });
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM + "?lang=en");
    });
});

function createMockSessionMiddleware () {
    customMockSessionMiddleware = sessionMiddleware as jest.Mock;
    const session = getSessionRequestWithPermission();
    session.setExtraData(ACSP_DETAILS_UPDATED, { ...dummyFullProfile, type: "sole-trader" });
    session.setExtraData(ADDRESS_LIST, addressList);
    session.setExtraData(SUBMISSION_ID, "transactionID");
    customMockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        next();
    });
}
