import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { TYPE_OF_BUSINESS, BASE_URL, CHECK_SAVED_APPLICATION } from "../../../../src/types/pageURL";
import { getSavedApplication } from "../../../../src/services/transactions/transaction_service";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { getRedirectionUrl } from "../../../../src/services/checkSavedApplicationService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/transactions/transaction_service");
jest.mock("../../../../src/services/checkSavedApplicationService");
const router = supertest(app);

const mockGetSavedApplication = getSavedApplication as jest.Mock;
const mockGetRedirectionUrl = getRedirectionUrl as jest.Mock;

const hasSavedApplication: Resource<TransactionList> = {
    httpStatusCode: 200
};
const hasNoSavedApplication: Resource<TransactionList> = {
    httpStatusCode: 404
};
const errorSavedApplication = {
    httpStatusCode: 500
};

describe("GET " + CHECK_SAVED_APPLICATION, () => {

    it("should show the error screen if getSavedApplication fails", async () => {
        mockGetSavedApplication.mockRejectedValueOnce(errorSavedApplication);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(500);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Sorry we are experiencing technical difficulties");
    });

    it("should redirect to type of business if saved application does not exists", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasNoSavedApplication);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });

    it("should redirect to redirection url if saved application exists", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasSavedApplication);
        mockGetRedirectionUrl.mockResolvedValueOnce(BASE_URL + TYPE_OF_BUSINESS);

        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
    });
});
