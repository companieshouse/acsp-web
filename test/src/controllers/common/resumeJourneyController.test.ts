import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { BASE_URL, TYPE_OF_BUSINESS } from "../../../../src/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

describe("GET resume journey", () => {
    it("should return status 302", async () => {
        const res = await router.get(BASE_URL + "/resume?transactionId=119709-207817-181835&acspId=Y2VkZWVlMzhlZWFjY2M4MzQ3MT");
        expect(res.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });
});
