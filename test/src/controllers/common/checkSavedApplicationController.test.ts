import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { TYPE_OF_BUSINESS, BASE_URL, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, CANNOT_SUBMIT_ANOTHER_APPLICATION } from "../../../../src/types/pageURL";
import { getSavedApplication } from "../../../../src/services/acspRegistrationService";
import { HttpResponse } from "@companieshouse/api-sdk-node/dist/http";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
const router = supertest(app);

const mockGetSavedApplication = getSavedApplication as jest.Mock;
const hasSavedApplication: HttpResponse = {
    status: 204
};
const hasNoSavedApplication: HttpResponse = {
    status: 404
};

const applicationProcessing: HttpResponse = {
    status: 403
};

const errorSavedApplication: HttpResponse = {
    status: 500
};

describe("GET " + CHECK_SAVED_APPLICATION, () => {

    it("should redirect to continue with saved application screen if exists", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + SAVED_APPLICATION + "?lang=en");
    });

    it("should redirect to type of business if saved application does not exists", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasNoSavedApplication);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });

    it("should redirect to cannot submit another application screen if saved application is processing", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(applicationProcessing);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION + "?lang=en");
    });

    it("should show the error screen if getSavedApplication fails", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(errorSavedApplication);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(500);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Sorry we are experiencing technical difficulties");
    });
});
