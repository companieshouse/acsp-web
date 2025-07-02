/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_CLOSE_ACSP = "true";

import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { CLOSE_ACSP_BASE_URL, CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, CLOSE_CONFIRMATION_ACSP_CLOSED } from "../../../../src/types/pageURL";
import * as localise from "../../../../src/utils/localise";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import { postAcspRegistration } from "../../../../src/services/acspRegistrationService";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";

const router = supertest(app);

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/acspProfileService");

const mockPostTransaction = postTransaction as jest.Mock;
const mockPostRegistration = postAcspRegistration as jest.Mock;
const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;

describe("GET " + CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, () => {

    it("should return status 200 and render the page", async () => {
        const res = await router.get(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("Confirm you want to close the authorised agent account");
        expect(res.status).toBe(200);
    });

    it("should return status 500 if an error occurs", async () => {
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error("Test error");
        });
        const res = await router.get(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE, () => {

    it("should return status 302 after redirect", async () => {
        await mockPostTransaction.mockResolvedValueOnce({});
        await mockPostRegistration.mockResolvedValueOnce({});
        await mockGetAcspFullProfile.mockResolvedValueOnce({ status: "active" });
        const res = await router.post(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRMATION_ACSP_CLOSED + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when an status is CEASED", async () => {
        await mockPostTransaction.mockResolvedValueOnce({});
        await mockPostRegistration.mockResolvedValueOnce({});
        await mockGetAcspFullProfile.mockResolvedValueOnce({ status: "ceased" });
        const res = await router.post(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should return status 500 when an error occurs", async () => {
        await mockPostRegistration.mockRejectedValueOnce(new Error("Test error"));
        const res = await router.post(CLOSE_ACSP_BASE_URL + CLOSE_CONFIRM_YOU_WANT_TO_CLOSE);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
