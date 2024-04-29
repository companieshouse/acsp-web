import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { SIGN_OUT_URL, BASE_URL } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SIGN_OUT_URL, () => {
    it("should return status 200", async () => {
        await router.get(BASE_URL + SIGN_OUT_URL).expect(200);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test will return 302 after redirecting to the next page.
describe("POST " + SIGN_OUT_URL, () => {
    it("should return status 302 after redirect", async () => {
        // Make a POST request with signout: "yes" to trigger redirection
        await router.post(BASE_URL + SIGN_OUT_URL)
            .send({ signout: "yes" })
            .expect(302);
    });
});

describe("POST " + SIGN_OUT_URL, () => {
    it("should return status 302 after redirect", async () => {
        // Make a POST request with signout: "yes" to trigger redirection
        await router.post(BASE_URL + SIGN_OUT_URL)
            .send({ signout: "no" })
            .expect(302);
    });
});

describe("POST " + SIGN_OUT_URL, () => {
    it("should return status 400 after incorrect data entered", async () => {
        const response = await router.post(BASE_URL + SIGN_OUT_URL).send({ signout: "" });
        expect(400);
        expect(response.text).toContain("Select yes if you want to sign out");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
