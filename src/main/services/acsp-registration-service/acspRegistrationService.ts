import { Resource } from "@companieshouse/api-sdk-node";
import { createAndLogError, logger } from "../utils/logger";
import { createPublicOAuthApiClient } from "./api/api_service";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { ApiErrorResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { OfficerFiling, FilingResponse } from "@companieshouse/api-sdk-node/dist/services/officer-filing";

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
/**
 * POST an acsp registration object for the given transaction ID. The information within this filing can be built upon using patches.
 * @param session The current session to connect to the api
 * @param transactionId The acsp registration associated transaction ID
 * @param appointmentId The only field set on the acsp registration object
 * @returns The registrationResponse contains the submission ID for the newly created filing
 */
export const postAcspRegistration = async (session: Session, transactionId: string, officerFiling: OfficerFiling): Promise<FilingResponse> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`acsp registration filing for transaction ${transactionId}`);
    const sdkResponse: Resource<FilingResponse> | ApiErrorResponse = await apiClient.officerFiling.postOfficerFiling(transactionId, officerFiling);

    if (!sdkResponse) {
        throw createAndLogError(`acsp registration POST request returned no response for transaction ${transactionId}`);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        throw createAndLogError(`Http status code ${sdkResponse.httpStatusCode} - Failed to post acsp registration for transaction ${transactionId}`);
    }

    const castedSdkResponse: Resource<FilingResponse> = sdkResponse as Resource<FilingResponse>;
    if (!castedSdkResponse.resource) {
        throw createAndLogError(`acsp registration API POST request returned no resource for transaction ${transactionId}`);
    }

    logger.debug(`acsp registration ${JSON.stringify(sdkResponse)}`);
    return castedSdkResponse.resource;
};
/**
   * PATCH an acsp registration object for the given transaction ID and appointment ID.
   * Only the referenced appointment ID has been set on the filing object, any further information will be sent via a series of patches.
   * @param session The current session to connect to the api
   * @param transactionId The acsp registration associated transaction ID
   * @param appointmentId The only field set on the acsp registration object
   * @returns The acsp registrationResponse contains the submission ID for the newly created acsp registration
   */
export const patchAcspRegistration = async (session: Session, transactionId: string, filingId: string, officerFiling: OfficerFiling): Promise<FilingResponse> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    logger.debug(`Patching acsp registration for transaction ${transactionId}`);
    const sdkResponse: Resource<FilingResponse> | ApiErrorResponse = await apiClient.officerFiling.patchOfficerFiling(transactionId, filingId, officerFiling);

    if (!sdkResponse) {
        throw createAndLogError(`acsp registration PATCH request returned no response for transaction ${transactionId}`);
    }
    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        throw createAndLogError(`Http status code ${sdkResponse.httpStatusCode} - Failed to patch acsp registration for transaction ${transactionId}`);
    }

    const castedSdkResponse: Resource<FilingResponse> = sdkResponse as Resource<FilingResponse>;
    if (!castedSdkResponse.resource) {
        throw createAndLogError(`acsp registration API PATCH request returned no resource for transaction ${transactionId}`);
    }

    logger.debug(`Patched acsp registration ${JSON.stringify(sdkResponse)}`);
    return castedSdkResponse.resource;
};
