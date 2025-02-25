/* eslint-disable import/first */
import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_YOUR_ANSWERS, UPDATE_WHAT_IS_THE_BUSINESS_NAME, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { ACSP_DETAILS } from "../../../../src/common/__utils/constants";
import { mockSoleTraderAcspFullProfile } from "../../../mocks/update_your_details.mock";

jest.mock("@companieshouse/api-sdk-node");

const router = supertest(app);

describe("GET" + UPDATE_WHAT_IS_THE_BUSINESS_NAME, () => {
    it("should return status 200", async () => {
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the name of the business?");
    });
});
/*
describe("POST" + UPDATE_WHAT_IS_THE_BUSINESS_NAME, () => {
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME)
            .send({
                whatIsTheBusinessName: "abc ltd"
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockUpdateAcspAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_YOUR_ANSWERS + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_WHAT_IS_THE_BUSINESS_NAME);
        expect(res.status).toBe(400);
    });
});
*/
