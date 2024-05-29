import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../main/app";
import { SAVED_APPLICATION, BASE_URL, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../main/types/pageURL";

jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

describe("GET" + SAVED_APPLICATION, () => {
    it("should return status 200", async () => {
        const response = await router.get(BASE_URL + SAVED_APPLICATION).expect(200);
        expect(response.text).toContain("Do you want to continue with a saved application?");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

// Test will return 302 after redirecting to the next page.
describe("POST " + SAVED_APPLICATION, () => {
    it("should return status 302 after redirect", async () => {
        // Make a POST request with signout: "yes" to trigger redirection
        const response = await router.post(BASE_URL + SAVED_APPLICATION)
            .send({ savedApplication: "Yes - continue with a saved application" })
            .expect(302);
        expect(response.header.location).toBe(YOUR_FILINGS);
    });
});

describe("POST " + SAVED_APPLICATION, () => {
    it("should return status 302 after redirect", async () => {
        // Make a POST request with signout: "yes" to trigger redirection
        const response = await router.post(BASE_URL + SAVED_APPLICATION)
            .send({ savedApplication: "No - start a new application" })
            .expect(302);
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS);
    });
});

describe("POST " + SAVED_APPLICATION, () => {
    it("should return status 400 after incorrect data entered", async () => {
        const response = await router.post(BASE_URL + SAVED_APPLICATION).send({ signout: "" });
        expect(400);
        expect(response.text).toContain("Select yes if you want to continue with saved application");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
