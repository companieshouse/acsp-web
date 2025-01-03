/* eslint-disable import/first */
jest.mock("../../../../src/services/acspProfileService");
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, UPDATE_YOUR_ANSWERS } from "../../../../src/types/pageURL";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
const router = supertest(app);

const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;

describe("GET " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 200", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(200);
    });

    it("should return status 500 after calling getAcspFullProfile endpoint and failing", async () => {
        mockGetAcspFullProfile.mockRejectedValueOnce(new Error("Error getting data"));
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
