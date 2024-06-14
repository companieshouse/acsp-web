import mocks from "../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../src/app";
import { SAVED_APPLICATION, BASE_URL, TYPE_OF_BUSINESS, YOUR_FILINGS } from "../../../src/types/pageURL";
import { deleteAcspApplication } from "../../../src/services/acspRegistrationService";
import { HttpResponse } from "@companieshouse/api-sdk-node/dist/http";

jest.mock("../../../main/services/acspRegistrationService");
jest.mock("@companieshouse/api-sdk-node");
const router = supertest(app);

const mockDeleteAcspRegistration = deleteAcspApplication as jest.Mock;

describe("GET" + SAVED_APPLICATION, () => {
    it("should return status 200", async () => {
        const response = await router.get(BASE_URL + SAVED_APPLICATION).expect(200);
        expect(response.text).toContain("Do you want to continue with a saved application?");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});

describe("POST " + SAVED_APPLICATION, () => {
    // Make a POST request with signout: "yes" to trigger redirection
    it("should return status 302 after redirect", async () => {
        // Make a POST request with signout: "yes" to trigger redirection
        const response = await router.post(BASE_URL + SAVED_APPLICATION).send({ savedApplication: "yes" });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(YOUR_FILINGS);
    });
    // Make a POST request with signout: "no" to trigger redirection
    it("should return status 302 after redirect", async () => {
        mockDeleteAcspRegistration.mockResolvedValueOnce({ status: 204 }as HttpResponse);

        const response = await router.post(BASE_URL + SAVED_APPLICATION).send({ savedApplication: "no" });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS);
    });
    // Make a POST request with signout: "no" deleteAcspRegistration throws error
    it("should return status 302 after redirect", async () => {
        mockDeleteAcspRegistration.mockRejectedValueOnce(new Error("Failed to delete document"));
        const res = await router.post(BASE_URL + SAVED_APPLICATION).send({ savedApplication: "no" });
        expect(res.status).toBe(500);
        expect(res.text).toContain("Sorry we are experiencing technical difficulties");
    });

    // Make a POST request with signout: "" will return 400 for incorrect input
    it("should return status 400 after incorrect data entered", async () => {
        const response = await router.post(BASE_URL + SAVED_APPLICATION).send({ signout: "" });
        expect(response.status).toBe(400);
        expect(response.text).toContain("Select yes if you want to continue with saved application");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
});
