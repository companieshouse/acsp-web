/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import { createRequest, MockRequest, Session } from "node-mocks-http";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../../../src/common/__utils/constants";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_APPLICATION_CONFIRMATION } from "../../../../src/types/pageURL";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import * as localise from "../../../../src/utils/localise";

const router = supertest(app);

jest.mock("../../../../src/services/transactions/transaction_service");

const mockPostTransaction = postTransaction as jest.Mock;

describe("GET " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
    it("should show the error page if an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("GET " + UPDATE_ACSP_DETAILS_BASE_URL + "?lang=en&amlindex=123456789", () => {
    let req: MockRequest<Request>;
    beforeEach(() => {
        req = createRequest({
            method: "GET",
            url: "/"
        });
        const session = getSessionRequestWithPermission();
        req.session = session;
        session.setExtraData(ACSP_DETAILS, dummyFullProfile);
        session.setExtraData(ACSP_DETAILS_UPDATED, dummyFullProfile);
    });
    it("should return status 200", async () => {
        const session: Session = req.session as any as Session;
        await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en&amlindex=123456789");
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].supervisoryBody).toBe("");
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].membershipDetails).toBe("");
    });
    it("should return status 200", async () => {
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_DETAILS_UPDATED,
            {
                ...dummyFullProfile,
                amlDetails: [{
                    supervisoryBody: "",
                    membershipDetails: ""
                }]
            }
        );
        await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en&amlindex=123456789");
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].supervisoryBody).toBe("");
        expect(session.getExtraData(ACSP_DETAILS_UPDATED).amlDetails[0].membershipDetails).toBe("");
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should show the error page if an error occurs", async () => {
        await mockPostTransaction.mockRejectedValueOnce(new Error("Error creating transaction"));
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
    it("should return status 302 after redirect", async () => {
        await mockPostTransaction.mockResolvedValueOnce({ id: "12345" });
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
