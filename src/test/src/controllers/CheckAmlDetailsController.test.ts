import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { AML_BODY_DETAILS_CONFIRM, CHECK_YOUR_ANSWERS, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + AML_BODY_DETAILS_CONFIRM, () => {
    it("should return status 200", async () => {
        const res = await router.get(BASE_URL + AML_BODY_DETAILS_CONFIRM);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("Check the AML details");
    });
});

// Test for correct details, will return 302 after redirecting to the next page.
describe("POST" + AML_BODY_DETAILS_CONFIRM, () => {
    it("should return status 302 after redirect", async () => {
        const res = await router.post(BASE_URL + AML_BODY_DETAILS_CONFIRM);
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + CHECK_YOUR_ANSWERS + "?lang=en");
    });
});
