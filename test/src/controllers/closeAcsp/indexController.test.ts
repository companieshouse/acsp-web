/* eslint-disable import/first */
jest.mock("../../../../src/services/acspProfileService");
process.env.FEATURE_FLAG_ENABLE_CLOSE_ACSP = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { CLOSE_ACSP_BASE_URL, CLOSE_WHAT_WILL_HAPPEN } from "../../../../src/types/pageURL";
import { getAcspFullProfile } from "../../../../src/services/acspProfileService";
import { dummyFullProfile } from "../../../mocks/acsp_profile.mock";
import * as localise from "../../../../src/utils/localise";
const router = supertest(app);

const mockGetAcspFullProfile = getAcspFullProfile as jest.Mock;

describe("GET " + CLOSE_ACSP_BASE_URL, () => {
    it("should return status 200", async () => {
        mockGetAcspFullProfile.mockResolvedValueOnce(dummyFullProfile);
        const res = await router.get(CLOSE_ACSP_BASE_URL);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(res.text).toContain("close-authorised-agent");
        expect(200);
    });
});

describe("POST " + CLOSE_ACSP_BASE_URL, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(CLOSE_ACSP_BASE_URL);
        expect(res.status).toBe(302);
        expect(res.header.location).toBe(CLOSE_ACSP_BASE_URL + CLOSE_WHAT_WILL_HAPPEN + "?lang=en");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
    });
    it("should return status 500 when an error occurs", async () => {
        const errorMessage = "Test error";
        jest.spyOn(localise, "selectLang").mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });
        const res = await router.post(CLOSE_ACSP_BASE_URL);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
