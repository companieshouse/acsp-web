import mocks from "../../../mocks/all_middleware_mock";
import supertest from "supertest";
import app from "../../../../src/app";
import { TYPE_OF_BUSINESS, BASE_URL, CHECK_SAVED_APPLICATION, SAVED_APPLICATION, CANNOT_SUBMIT_ANOTHER_APPLICATION, CANNOT_REGISTER_AGAIN } from "../../../../src/types/pageURL";
import { getSavedApplication } from "../../../../src/services/transactions/transaction_service";
import { TransactionList } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import { deleteAcspApplication } from "../../../../src/services/acspRegistrationService";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../../src/services/acspRegistrationService");
jest.mock("../../../../src/services/transactions/transaction_service");
const router = supertest(app);

const mockGetSavedApplication = getSavedApplication as jest.Mock;
const mockDeleteSavedApplication = deleteAcspApplication as jest.Mock;
const hasOpenApplication: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: ""
        }]
    }
};
const hasRejectedApplication: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "closed",
            filings: { "123-1": { status: "rejected" } }
        }]
    }
};
const hasApprovedApplication: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "closed",
            filings: { "123-1": { status: "approved" } }
        }]
    }
};
const hasApplicationInProgress: Resource<TransactionList> = {
    httpStatusCode: 200,
    resource: {
        items: [{
            id: "123",
            status: "closed",
            filings: { "123-1": { status: "in progress" } }
        }]
    }
};
const hasNoSavedApplication: Resource<TransactionList> = {
    httpStatusCode: 404
};
const errorSavedApplication = {
    httpStatusCode: 500
};

describe("GET " + CHECK_SAVED_APPLICATION, () => {

    it("should redirect to continue with saved application screen if exists", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasOpenApplication);
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
        mockGetSavedApplication.mockResolvedValueOnce(hasApplicationInProgress);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + CANNOT_SUBMIT_ANOTHER_APPLICATION + "?lang=en");
    });

    it("should redirect to cannot register again screen if saved  application is approved", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasApprovedApplication);
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + CANNOT_REGISTER_AGAIN + "?lang=en");
    });

    it("should redirect to type of business if saved application is rejected", async () => {
        mockGetSavedApplication.mockResolvedValueOnce(hasRejectedApplication);
        mockDeleteSavedApplication.mockResolvedValueOnce("");
        const response = await router.get(BASE_URL + CHECK_SAVED_APPLICATION);
        expect(response.status).toBe(302);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.header.location).toBe(BASE_URL + TYPE_OF_BUSINESS + "?lang=en");
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
