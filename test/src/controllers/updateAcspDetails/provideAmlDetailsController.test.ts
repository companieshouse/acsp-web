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
        expect(res.text).toContain("You need to provide details for an Anti-Money Laundering (AML) supervisory body");
        expect(res.text).toContain("You must add an Anti-Money Laundering (AML) supervisory body and membership number before you can submit your application.");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalledTimes(1);
        expect(200);
    });
});
