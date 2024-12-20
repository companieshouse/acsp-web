import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_DETAILS_BASE_URL, HOME_URL, UPDATE_YOUR_ANSWERS, ACSP_DETAILS_UPDATE_CONFIRMATION } from "../../../../src/types/pageURL";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
const router = supertest(app);

jest.mock("../../../../src/services/acspProfileService");

const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;

describe("GET " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 200", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(200);
    });
    
    it("should return status 200", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("View and update the authorised agent&#39;s details");
        expect(res.text).toContain("Anti-Money Laundering (AML) details");
        expect(200);
    });
});

describe("POST " + UPDATE_ACSP_DETAILS_BASE_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + ACSP_DETAILS_UPDATE_CONFIRMATION + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
});
