import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../utils/logger";
import { createPublicOAuthApiClient } from "./apiService";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { AcspData, AcspResponse } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { HttpResponse } from "@companieshouse/api-sdk-node/dist/http";

/**
 * GET an acsp registration object with the given transaction ID and acspApplicationId.
 * @param session The current session to connect to the api
 * @param transactionId The acsp registration associated transaction ID
 * @param applicationId: The ID set on the acsp registration object
 * @returns The acsp registration details
 */

export const getAcspRegistration = async (session: Session, transactionId:string, acspApplicationId: string): Promise<AcspData> => {
    logger.info(`GET - Retrieving acsp registration for transaction ID: ${transactionId} and application ID: ${acspApplicationId}`);
    if (!transactionId) {
        logger.error(`acsp registration GET request failed - no transaction ID provided for transaction ID: ${transactionId}`);
        return Promise.reject(new Error("No transaction ID provided"));
    }
    if (!acspApplicationId) {
        logger.error(`acsp registration GET request failed - no application ID provided for application ID: ${acspApplicationId}`);
        return Promise.reject(new Error("No application  ID provided"));
    }

    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Retrieving acsp registration details for application ID: ${acspApplicationId}`);
    const sdkResponse: Resource<AcspData> | ApiErrorResponse = await apiClient.acsp.getAcsp(transactionId, acspApplicationId);

    if (!sdkResponse) {
        logger.error(`acsp registration GET request returned no response for application ID: ${acspApplicationId}`);
        return Promise.reject(sdkResponse);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} and error ${JSON.stringify(sdkResponse)} - Failed to get acsp registration for application ID: ${acspApplicationId}`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: Resource<AcspData> = sdkResponse as Resource<AcspData>;
    if (castedSdkResponse.resource === undefined) {
        logger.error(`acsp registration API GET request returned no resource for application ID: ${acspApplicationId}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`acsp registration details ${JSON.stringify(sdkResponse)}`);
    return Promise.resolve(castedSdkResponse.resource);
};

/**
 * POST an acsp registration object for the given transaction ID. The information within this registration can be built upon using put requests.
 * @param session The current session to connect to the api
 * @param transactionId The filings associated transaction ID
 * @returns The AcspResponse contains the submission ID for the newly created registration
 */
export const postAcspRegistration = async (session: Session, transactionId: string, acsp: AcspData, firstTime: boolean): Promise<AcspResponse> => {

    if (firstTime === false) {

        logger.info(`POST - Updating acsp registration for transaction ID: ${transactionId} and application ID: ${acsp.id}`);
        if (!transactionId) {
            logger.error(`acsp registration POST request failed - no transaction ID provided for transaction ID: ${transactionId}`);
            return Promise.reject(new Error("No transaction ID provided"));
        }
        if (!acsp.id) {
            logger.error(`acsp registration POST request failed - no application ID provided for application ID: ${acsp.id}`);
            return Promise.reject(new Error("No application ID provided"));
        }
    }

    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`POSTing acsp registration for transaction ${transactionId}`);
    const sdkResponse: Resource<AcspResponse> | ApiErrorResponse = await apiClient.acsp.postACSP(transactionId, acsp);

    if (!sdkResponse) {
        logger.error(`acsp registration POST request returned no response for transaction ${transactionId}`);
        return Promise.reject(sdkResponse);
    }
    if (!sdkResponse.httpStatusCode || (sdkResponse.httpStatusCode >= 400 && sdkResponse.httpStatusCode !== 409)) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to POST acsp registration for transaction ${transactionId}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode === 409) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - A document already exists with the id ${acsp.id}`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: Resource<AcspResponse> = sdkResponse as Resource<AcspResponse>;
    if (castedSdkResponse.resource === undefined) {
        logger.error(`acsp registration API POST request returned no resource for transaction ${transactionId}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`acsp registration ${JSON.stringify(sdkResponse)}`);
    return Promise.resolve(castedSdkResponse.resource);
};

/**
 * PUT an acsp registration object for the given transaction ID.
 * @param session The current session to connect to the api
 * @param transactionId The filings associated transaction ID
 * @returns The AcspResponse contains the submission ID for the updated registration
 */
export const putAcspRegistration = async (session: Session, transactionId: string, acsp: AcspData): Promise<AcspResponse> => {

    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`PUTing acsp registration for transaction ${transactionId}`);

    const sdkResponse: Resource<AcspResponse> | ApiErrorResponse = await apiClient.acsp.putACSP(transactionId, acsp.id!, acsp);

    if (!sdkResponse) {
        logger.error(`acsp registration PUT request returned no response for transaction ${transactionId}`);
        return Promise.reject(sdkResponse);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to PUT acsp registration for transaction ${transactionId}`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: Resource<AcspResponse> = sdkResponse as Resource<AcspResponse>;
    if (castedSdkResponse.resource === undefined) {
        logger.error(`acsp registration API PUT request returned no resource for transaction ${transactionId}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`acsp registration ${JSON.stringify(sdkResponse)}`);
    return Promise.resolve(castedSdkResponse.resource);
};

/**
 * DELETE an acsp registration object for the given user ID.
 * @param session The current session to connect to the api
 * @param userId The user ID of for the document of be delete.
 * @returns The AcspResponse contains the submission ID for the updated registration
 */
export const deleteAcspApplication = async (session: Session, transactionId: string, acspApplicationId: string): Promise<HttpResponse> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Deleting acsp registration for application ID: ${acspApplicationId}`);
    const sdkResponse: HttpResponse = await apiClient.acsp.deleteSavedApplication(transactionId, acspApplicationId);

    if (!sdkResponse) {
        logger.error(`acsp registration DELETE request returned no response for application ID: ${acspApplicationId}`);
        return Promise.reject(sdkResponse);
    }
    if (!sdkResponse.status || sdkResponse.status >= 400) {
        logger.error(`Http status code ${sdkResponse.status} - Failed to DELETE acsp registration for application ID: ${acspApplicationId}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`acsp registration for application ID: ${acspApplicationId} has been deleted`);
    return Promise.resolve(sdkResponse);
};
