import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { UPDATE_ACSP_CHANGE_DETAILS, UPDATE_ACSP_WHAT_IS_YOUR_NAME, UPDATE_ACSP_DETAILS_BASE_URL } from "../../../../src/types/pageURL";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp/types";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import { USER_DATA } from "../../../../src/common/__utils/constants";

jest.mock("@companieshouse/api-sdk-node");

const router = supertest(app);

describe("GET" + UPDATE_ACSP_WHAT_IS_YOUR_NAME, () => {
    it("should return status 200", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(USER_DATA, {
            applicantDetails: {
                firstName: "John",
                lastName: "Doe"
            }
        });
        const res = await router.get(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is your name?");
    });
});

describe("POST" + UPDATE_ACSP_WHAT_IS_YOUR_NAME, () => {
    // Test for correct form details entered, will return 302 after redirecting to the next page.
    it("should return status 302 after redirect", async () => {
        const session = getSessionRequestWithPermission();
        session.setExtraData(USER_DATA, {});
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME)
            .send({
                "first-name": "John",
                "middle-names": "",
                "last-name": "Doe"
            });
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_CHANGE_DETAILS + "?lang=en");
    });

    // Test for incorrect form details entered, will return 400.
    it("should return status 400 after incorrect data entered", async () => {
        const res = await router.post(UPDATE_ACSP_DETAILS_BASE_URL + UPDATE_ACSP_WHAT_IS_YOUR_NAME);
        expect(res.status).toBe(400);
    });
});
