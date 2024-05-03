import { Resource } from "@companieshouse/api-sdk-node";
import { Session } from "@companieshouse/node-session-handler";
import { createPublicOAuthApiClient } from "../../../main/services/api/api_service";
import {
    getAcspRegistration,
    postAcspRegistration
} from "../../../main/services/acspRegistrationService";
import { StatusCodes } from "http-status-codes";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { Acsp, AcspDto, AcspResponse } from "@companieshouse/api-sdk-node/dist/services/acsp";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../main/services/api/api_service");

const mockCreatePublicOAuthApiClient = createPublicOAuthApiClient as jest.Mock;
const mockPostAcspRegistration = jest.fn();
const mockGetAcspRegistration = jest.fn();

mockCreatePublicOAuthApiClient.mockReturnValue({
    acsp: {
        getAcsp: mockGetAcspRegistration,
        postACSP: mockPostAcspRegistration
    }
});

let session: any;
const TRANSACTION_ID = "2222";
const EMAIL_ID = "example@example.com";
const acsp: Acsp = {
    id: EMAIL_ID,
    typeOfBusiness: "LIMITED"
};

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
                        typeOfBusiness: "LIMITED"
                    }
                }
            });

            const acspResponse: AcspResponse = await postAcspRegistration(session, TRANSACTION_ID, acsp);

            expect(acspResponse.data.id).toEqual(EMAIL_ID);
            expect(acspResponse.data.typeOfBusiness).toEqual("LIMITED");
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
                httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });

            await expect(postAcspRegistration(session, TRANSACTION_ID, acsp))
                .rejects.toEqual({ httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR });
        });
    });

    describe("getAcspRegistration tests", () => {
        it("Should return a acspRegistration", async () => {
            const dummyAcspDto: AcspDto = {
                id: EMAIL_ID,
                typeOfBusiness: "LIMITED"
            };

            mockGetAcspRegistration.mockResolvedValueOnce({
                httpStatusCode: 200,
                resource: dummyAcspDto
            } as Resource<AcspDto>);

            const acspDto: AcspDto = await getAcspRegistration(session, TRANSACTION_ID, EMAIL_ID);

            expect(acspDto).toStrictEqual(dummyAcspDto);
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
                httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });

            await expect(getAcspRegistration(session, TRANSACTION_ID, EMAIL_ID)).rejects.toEqual({ httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR });
        });
    });
});
