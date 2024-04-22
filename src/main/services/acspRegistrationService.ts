import { Resource } from "@companieshouse/api-sdk-node";
import { createAndLogError, logger } from "../utils/logger";
import { createPublicOAuthApiClient } from "./api/api_service";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { AcspDto, Acsp } from "@companieshouse/api-sdk-node/dist/services/acsp";

/**
 * GET an acsp registration object with the given transaction ID and emailId.
 * @param session The current session to connect to the api
 * @param transactionId The acsp registration associated transaction ID
 * @param emailId The Id set on the acsp registration object
 * @returns The acsp registration details
 */

export const getAcspRegistration = async (session: Session, transactionId:string, emailId: string): Promise<Acsp> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Retrieving acsp registration details for emailId ${emailId}`);
    const sdkResponse: Resource<AcspDto> | ApiErrorResponse = await apiClient.acsp.getAcsp(transactionId, emailId);

    if (!sdkResponse) {
        logger.error(`acsp registration GET request returned no response for emailId ${emailId}`);
        return Promise.reject(sdkResponse);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} and error ${JSON.stringify(sdkResponse)} - Failed to get acsp registration for emailId ${emailId}`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: Resource<Acsp> = sdkResponse as Resource<Acsp>;
    if (!castedSdkResponse.resource) {
        logger.error(`acsp registration API GET request returned no resource for emailId ${emailId}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`acsp registration details ${JSON.stringify(sdkResponse)}`);
    return Promise.resolve(castedSdkResponse.resource);
};
