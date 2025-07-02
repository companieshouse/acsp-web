import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SAVED_APPLICATION, BASE_URL, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../src/types/pageURL";
import { deleteAcspApplication } from "../../../src/services/acspRegistrationService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockDeleteAcspApplication = deleteAcspApplication as jest.Mock;

describe("GET" + SAVED_APPLICATION, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should return status 200", async () => {
        const response = await router.get(BASE_URL + SAVED_APPLICATION).expect(200);
        expect(response.text).toContain("Do you want to start a new application?");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + SAVED_APPLICATION, () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
        jest.clearAllMocks();
        jest.resetModules();
    });
    it("should return status 302 after redirect", async () => {
        // Make a POST request with "no" to trigger redirection to filings
        const response = await router.post(BASE_URL + SAVED_APPLICATION)
            .send({ savedApplication: "no" })
            .expect(302);
        expect(response.header.location).toBe(YOUR_FILINGS);
    });

    it("should return status 302 after redirect", async () => {
        // Make a POST request with "yes" to trigger redirection to type of business page
        mockDeleteAcspApplication.mockResolvedValueOnce({ staus: 204 });
        const response = await router.post(BASE_URL + SAVED_APPLICATION)
            .send({ savedApplication: "yes" });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });

    it("should return status 400 after incorrect data entered", async () => {
        const response = await router.post(BASE_URL + SAVED_APPLICATION).send({ signout: "" });
        expect(400);
        expect(response.text).toContain("Select yes if you want to start a new application");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 500 after calling DELETE endpoint and failing", async () => {
        mockDeleteAcspApplication.mockRejectedValueOnce(new Error("Error deleting data"));
        const res = await router.post(BASE_URL + SAVED_APPLICATION).send({ savedApplication: "yes" });
        expect(mockDeleteAcspApplication).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
