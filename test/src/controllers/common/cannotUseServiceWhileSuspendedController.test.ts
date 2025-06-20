/* eslint-disable import/first */
jest.mock("../../../../src/services/acspProfileService");
process.env.FEATURE_FLAG_ENABLE_CLOSE_ACSP = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { CANNOT_USE_SERVICE_WHILE_SUSPENDED, CLOSE_ACSP_BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
const router = supertest(app);

const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;

describe("GET " + CANNOT_USE_SERVICE_WHILE_SUSPENDED, () => {
    it("should return status 200 from update acsp service", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + CANNOT_USE_SERVICE_WHILE_SUSPENDED);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("You cannot use this service while the authorised agent is suspended");
    });
    it("should return status 200 from close acsp service", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(CLOSE_ACSP_BASE_URL + CANNOT_USE_SERVICE_WHILE_SUSPENDED);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.text).toContain("You cannot use this service while the authorised agent is suspended");
    });
});
