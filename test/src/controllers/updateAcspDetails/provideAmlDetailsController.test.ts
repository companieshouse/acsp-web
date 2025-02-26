/* eslint-disable import/first */
process.env.FEATURE_FLAG_ENABLE_UPDATE_ACSP_DETAILS = "true";
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_PROVIDE_AML_DETAILS, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";

const router = supertest(app);

describe("GET " + UPDATE_PROVIDE_AML_DETAILS, () => {
    it("should respond with status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_PROVIDE_AML_DETAILS);
        expect(res.text).toContain("You must add Anti-Money Laundering (AML) details for at least one supervisory body before you submit the update.");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
});
