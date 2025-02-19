/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS, UPDATE_APPLICATION_CONFIRMATION } from "../../../../src/types/pageURL";
import { postTransaction } from "../../../../src/services/transactions/transaction_service";
import * as localise from "../../../../src/utils/localise";
import { postAcspRegistration } from "../../../../src/services/acspRegistrationService";

const router = supertest(app);

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/acspRegistrationService");

const mockPostTransaction = postTransaction as jest.Mock;
const mockPostRegistration = postAcspRegistration as jest.Mock;

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

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should show the error page if an error occurs", async () => {
        await mockPostTransaction.mockRejectedValueOnce(new Error("Error creating transaction"));
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
    it("should return status 302 after redirect", async () => {
        await mockPostTransaction.mockResolvedValueOnce({ id: "12345" });
        await mockPostRegistration.mockResolvedValueOnce({});
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_APPLICATION_CONFIRMATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
