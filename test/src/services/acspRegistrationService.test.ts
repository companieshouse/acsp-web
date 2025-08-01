import { Resource } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import { createPublicOAuthApiClient } from "../../../src/services/apiService";
import {
    getAcspRegistration,
    postAcspRegistration,
    putAcspRegistration,
    deleteAcspApplication
} from "../../../src/services/acspRegistrationService";
import { StatusCodes } from "http-status-codes";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { AcspData, AcspResponse } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { HttpResponse } from "@companieshouse/api-sdk-node/dist/http";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/services/apiService");

const mockCreatePublicOAuthApiClient = createPublicOAuthApiClient as jest.Mock;
const mockPostAcspRegistration = jest.fn();
const mockGetAcspRegistration = jest.fn();
const mockPutAcspRegistration = jest.fn();
const mockDeleteSavedApplication = jest.fn();

mockCreatePublicOAuthApiClient.mockReturnValue({
    acsp: {
        getAcsp: mockGetAcspRegistration,
        postACSP: mockPostAcspRegistration,
        putACSP: mockPutAcspRegistration,
        deleteSavedApplication: mockDeleteSavedApplication
    }
});

let session: any;
const TRANSACTION_ID = "2222";
const EMAIL_ID = "example@example.com";
const acsp: AcspData = {
    id: EMAIL_ID,
    typeOfBusiness: "LIMITED"
};
const USER_ID = "Y2VkZWVlMzhlZWFjY2M4MzQ3MT";

describe("acsp service tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
    });

    describe("postAcspRegistration tests", () => {

        it("Should successfully post a Acsp Registration", async () => {
            mockPostAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: 200,
                resource: {
                    data: {
                        id: "example@example.com",
                        type_of_business: "LIMITED"
                    }
                }
            });

            const acspResponse: AcspResponse = await postAcspRegistration(session, TRANSACTION_ID, acsp);

            expect(acspResponse.data.id).toEqual(EMAIL_ID);
            expect(acspResponse.data.type_of_business).toEqual("LIMITED");
        });

        it("Should throw an error when no acsp api response", async () => {
            mockPostAcspRegistration.mockResolvedValueOnce(undefined);

            await expect(postAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toBe(undefined);
        });

        it("Should throw an error when acsp api returns a status greater than 400", async () => {
            mockPostAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NOT_FOUND
            });

            await expect(postAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.NOT_FOUND });
        });

        it("Should throw an error when acsp api returns status 409", async () => {
            mockPostAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.CONFLICT
            });

            await expect(postAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.CONFLICT });
        });

        it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
            mockPostAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(postAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE });
        });

        it("Should throw an error when acsp api returns no resource", async () => {
            mockPostAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NO_CONTENT
            } as Resource<AcspResponse>);

            await expect(postAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.NO_CONTENT });
        });
    });

    describe("putAcspRegistration tests", () => {

        it("Should successfully put an Acsp Registration", async () => {
            mockPutAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: 200,
                resource: {
                    data: {
                        id: "example@example.com",
                        type_of_business: "LIMITED"
                    }
                }
            });

            const acspResponse: AcspResponse = await putAcspRegistration(session, TRANSACTION_ID, acsp);

            expect(acspResponse.data.id).toEqual(EMAIL_ID);
            expect(acspResponse.data.type_of_business).toEqual("LIMITED");
        });

        it("Should throw an error when no acsp api response", async () => {
            mockPostAcspRegistration.mockResolvedValueOnce(undefined);

            await expect(putAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toBe(undefined);
        });

        it("Should throw an error when acsp api returns a status greater than 400", async () => {
            mockPutAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NOT_FOUND
            });

            await expect(putAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.NOT_FOUND });
        });

        it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
            mockPutAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(putAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE });
        });

        it("Should throw an error when acsp api returns no resource", async () => {
            mockPutAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NO_CONTENT
            } as Resource<AcspResponse>);

            await expect(putAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.NO_CONTENT });
        });
    });

    describe("getAcspRegistration tests", () => {
        it("Should return a acspRegistration", async () => {
            const dummyAcspData: AcspData = {
                id: EMAIL_ID,
                typeOfBusiness: "LIMITED"
            };

            mockGetAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: 200,
                resource: dummyAcspData
            } as Resource<AcspData>);

            const acspData: AcspData = await getAcspRegistration(session, TRANSACTION_ID, EMAIL_ID);

            expect(acspData).toStrictEqual(dummyAcspData);
        });

        it("Should throw an error when no acsp api response", async () => {
            mockGetAcspRegistration.mockResolvedValueOnce(undefined);

            await expect(getAcspRegistration(session, TRANSACTION_ID, EMAIL_ID)).rejects.toBe(undefined);
        });

        it("Should throw an error when acsp api returns a status greater than 400", async () => {
            mockGetAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: 404
            });

            await expect(getAcspRegistration(session, TRANSACTION_ID, EMAIL_ID)).rejects.toEqual({ httpStatusCode: StatusCodes.NOT_FOUND });
        });

        it("Should throw an error when acsp api returns no resource", async () => {
            mockGetAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NO_CONTENT
            } as Resource<AcspResponse>);

            await expect(getAcspRegistration(session, TRANSACTION_ID, EMAIL_ID)).rejects.toEqual({ httpStatusCode: StatusCodes.NO_CONTENT });
        });
    });

    describe("deleteAcspRegistration tests", () => {
        it("Should return a HttpResponse", async () => {
            const dummySuccessResponce: HttpResponse = {
                status: 204
            };

            mockDeleteSavedApplication.mockResolvedValueOnce({ status: 204 });

            const acspData = await deleteAcspApplication(session, TRANSACTION_ID, EMAIL_ID);

            expect(acspData).toStrictEqual(dummySuccessResponce);
        });

        it("Should throw an error when no acsp api response", async () => {
            mockDeleteSavedApplication.mockResolvedValueOnce(undefined);

            await expect(deleteAcspApplication(session, TRANSACTION_ID, EMAIL_ID)).rejects.toBe(undefined);
        });

        it("Should throw an error when acsp api returns a status greater than 400", async () => {
            mockDeleteSavedApplication.mockResolvedValueOnce({
                httpStatusCode: 404
            });

            await expect(deleteAcspApplication(session, TRANSACTION_ID, EMAIL_ID)).rejects.toEqual({ httpStatusCode: StatusCodes.NOT_FOUND });
        });
    });
    describe("getAcspRegistration additional validation tests", () => {
        it("Should throw an error when no transaction ID is provided", async () => {
            await expect(getAcspRegistration(session, "", EMAIL_ID)).rejects.toThrow("No transaction ID provided");
        });

        it("Should throw an error when no application ID is provided", async () => {
            await expect(getAcspRegistration(session, TRANSACTION_ID, "")).rejects.toThrow("No application  ID provided");
        });
    });
});
