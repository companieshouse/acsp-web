import { Resource } from "@companieshouse/api-sdk-node";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import logger from "../../../../lib/Logger";
import { createPublicOAuthApiClient } from "../api/api_service";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { ApiErrorResponse, ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { StatusCodes } from "http-status-codes";

import { CREATE_DESCRIPTION, REFERENCE, transactionStatuses } from "../../config";

/**
 * Post transaction
 */
export const postTransaction = async (session: Session, description: string, reference: string): Promise<Transaction> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    const transaction: Transaction = {
        reference,
        description
    };

    const sdkResponse: Resource<Transaction> | ApiErrorResponse = await apiClient.transaction.postTransaction(transaction);

    if (!sdkResponse) {
        logger.error(`Transaction API POST request returned no response`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to post transaction`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: Resource<Transaction> = sdkResponse as Resource<Transaction>;

    if (!castedSdkResponse.resource) {
        logger.error(`Transaction API POST request returned no resource`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received transaction ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(castedSdkResponse.resource);
};

/**
 * Close transaction
 */
export const closeTransaction = async (session: Session, companyNumber: string, transactionId: string, objectId: string|undefined): Promise<ApiResponse<Transaction>> => {
    const apiResponse: ApiResponse<Transaction> = await putTransaction(session, companyNumber, transactionId, CREATE_DESCRIPTION, transactionStatuses.CLOSED, objectId).catch((sdkResponse) => {
        return Promise.reject(sdkResponse);
    });
    return Promise.resolve(apiResponse);
};

/**
 * PUT transaction
 */
export const putTransaction = async (session: Session,
    companyNumber: string,
    transactionId: string,
    transactionDescription: string,
    transactionStatus: string,
    objectId: string|undefined): Promise<ApiResponse<Transaction>> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    const transaction: Transaction = {
        companyNumber,
        description: transactionDescription,
        id: transactionId,
        reference: REFERENCE + objectId,
        status: transactionStatus
    };

    logger.debug(`Updating transaction id ${transactionId} with company number ${companyNumber}, status ${transactionStatus}`);
    const sdkResponse: ApiResponse<Transaction> | ApiErrorResponse = await apiClient.transaction.putTransaction(transaction);

    if (!sdkResponse) {
        logger.error(`Transaction API PUT request returned no response for transaction id ${transactionId}, company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode !== StatusCodes.NO_CONTENT) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to put transaction for transaction id ${transactionId}, company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: ApiResponse<Transaction> = sdkResponse as ApiResponse<Transaction>;

    logger.debug(`Received transaction ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(castedSdkResponse);
};
