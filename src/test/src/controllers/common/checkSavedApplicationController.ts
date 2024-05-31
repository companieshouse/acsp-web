import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../main/app";
import { TYPE_OF_BUSINESS, BASE_URL, CHECK_SAVED_APPLICATION } from "../../../../main/types/pageURL";
import { getSavedApplication } from "../../../../main/services/acspRegistrationService";
import { SAVED_APPLICATION } from "../../../../main/config";
import { HttpResponse } from "@companieshouse/api-sdk-node/dist/http";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../main/services/acspRegistrationService");
const router = supertest(app);

const mockGetSavedApplication = getSavedApplication as jest.Mock;
const hasSavedApplication: HttpResponse = {
    status: 204
};
const hasNoSavedApplication: HttpResponse = {
    status: 404
};

describe("GET " + CHECK_SAVED_APPLICATION, () => {
    mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);

    it("should redirect to saved application if exists", async () => {
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + SAVED_APPLICATION + "?lang=en");
    });
});

describe("GET " + CHECK_SAVED_APPLICATION, () => {
    mockGetSavedApplication.mockResolvedValueOnce(hasNoSavedApplication);

    it("should redirect to type of business id saved application does not exists", async () => {
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });
});
