import { Resource } from "@companieshouse/api-sdk-node";
import { createAndLogError, logger } from "../utils/logger";
import { createPublicOAuthApiClient } from "./api/api_service";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { OfficerFiling, FilingResponse } from "@companieshouse/api-sdk-node/dist/services/officer-filing";
import { AcspDto } from "@companieshouse/api-sdk-node/dist/services/acsp";

/**
 * GET an acsp registration object with the given transaction ID and emailId.
 * @param session The current session to connect to the api
 * @param transactionId The acsp registration associated transaction ID
 * @param emailId The Id set on the acsp registration object
 * @returns The acsp registration details
 */
export const getAcspRegistration = async (session: Session, transactionId: string, emailId: string): Promise<OfficerFiling> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Retrieving acsp registration details for transaction ${transactionId}`);
    const sdkResponse: Resource<OfficerFiling> | ApiErrorResponse = await apiClient.officerFiling.getOfficerFiling(transactionId, emailId);

    if (!sdkResponse) {
        throw createAndLogError(`acsp registration GET request returned no response for transaction ${transactionId}`);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        throw createAndLogError(`Http status code ${sdkResponse.httpStatusCode} - Failed to get acsp registration for transaction ${transactionId}`);
    }

    const castedSdkResponse: Resource<OfficerFiling> = sdkResponse as Resource<OfficerFiling>;
    if (!castedSdkResponse.resource) {
        throw createAndLogError(`acsp registration API GET request returned no resource for transaction ${transactionId}`);
    }

    logger.debug(`acsp registration details ${JSON.stringify(sdkResponse)}`);
    return castedSdkResponse.resource;
};

export const getOfficerFiling = async (session: Session, transactionId: string, submissionId: string): Promise<OfficerFiling> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Retrieving officer filing for transaction ${transactionId}`);
    const sdkResponse: Resource<OfficerFiling> | ApiErrorResponse = await apiClient.officerFiling.getOfficerFiling(transactionId, submissionId);

    if (!sdkResponse) {
        throw createAndLogError(`Officer filing GET request returned no response for transaction ${transactionId}`);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        throw createAndLogError(`Http status code ${sdkResponse.httpStatusCode} - Failed to get officer filing for transaction ${transactionId}`);
    }

    const castedSdkResponse: Resource<OfficerFiling> = sdkResponse as Resource<OfficerFiling>;
    if (!castedSdkResponse.resource) {
        throw createAndLogError(`Officer filing API GET request returned no resource for transaction ${transactionId}`);
    }

    logger.debug(`Retrieved Officer Filing ${JSON.stringify(sdkResponse)}`);
    return castedSdkResponse.resource;
};

export const getAcsp = async (session: Session, transactionId:string, emailId: string): Promise<AcspDto> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Retrieving acsp registration details for emailId ${emailId}`);
    const sdkResponse: Resource<AcspDto> | ApiErrorResponse = await apiClient.acsp.getAcsp(transactionId, emailId);

    if (!sdkResponse) {
        throw createAndLogError(`acsp registration GET request returned no response for emailId ${emailId}`);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        throw createAndLogError(`Http status code ${sdkResponse.httpStatusCode} and error ${JSON.stringify(sdkResponse)} - Failed to get acsp registration for emailId ${emailId}`);
    }

    const castedSdkResponse: Resource<AcspDto> = sdkResponse as Resource<AcspDto>;
    if (!castedSdkResponse.resource) {
        throw createAndLogError(`acsp registration API GET request returned no resource for emailId ${emailId}`);
    }

    logger.debug(`acsp registration details ${JSON.stringify(sdkResponse)}`);
    return castedSdkResponse.resource;
};
