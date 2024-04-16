import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { BASE_URL, AML_MEMBERSHIP_NUMBER } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET " + AML_MEMBERSHIP_NUMBER, () => {
    it("should render the AML membership number page with status 200", async () => {
        const res = await router.get(BASE_URL + AML_MEMBERSHIP_NUMBER);
        expect(res.status).toBe(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(res.text).toContain("What is the Anti-Money Laundering (AML) membership number?");
    });
});

describe("POST" + AML_MEMBERSHIP_NUMBER, () => {
    it("Test for valid input, should return status 302 after redirect", async () => {
        await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_0: "ABC", membershipNumber_1: "CBA", membershipNumber__2: "Finance" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(302);
    });
});

describe("POST" + AML_MEMBERSHIP_NUMBER, () => {
    it("Test for invalid input , empty value - should return status 400", async () => {
        await router.post(BASE_URL + AML_MEMBERSHIP_NUMBER).send({ membershipNumber_0: " " });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(400);
    });
});
