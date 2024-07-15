import { Resource } from "@companieshouse/api-sdk-node";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import logger from "../../utils/logger";
import { createPublicOAuthApiClient } from "../apiService";
import { Session } from "@companieshouse/node-session-handler";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { ApiErrorResponse, ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { StatusCodes } from "http-status-codes";

import { CREATE_DESCRIPTION, REFERENCE, transactionStatuses } from "../../config";
import { headers } from "../../common/__utils/constants";

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
export const closeTransaction = async (session: Session, transactionId: string, companyName: string, companyNumber: string): Promise<string | undefined> => {
    const apiResponse: ApiResponse<Transaction> = await putTransaction(session, transactionId, CREATE_DESCRIPTION, companyName, companyNumber, transactionStatuses.CLOSED);
    return apiResponse.headers?.[headers.PAYMENT_REQUIRED];

};

/**
 * PUT transaction
 */
export const putTransaction = async (session: Session,
    transactionId: string,
    transactionDescription: string,
    companyName: string,
    companyNumber: string,
    transactionStatus: string): Promise<ApiResponse<Transaction>> => {
    const apiClient: ApiClient = createPublicOAuthApiClient(session);

    const transaction: Transaction = {
        description: transactionDescription,
        id: transactionId,
        reference: REFERENCE,
        status: transactionStatus,
        companyName: companyName,
        companyNumber: companyNumber
    };

    logger.debug(`Updating transaction id: ${transactionId}, status ${transactionStatus}`);
    const sdkResponse: ApiResponse<Transaction> | ApiErrorResponse = await apiClient.transaction.putTransaction(transaction);

    if (!sdkResponse) {
        logger.error(`Transaction API PUT request returned no response for transaction id: ${transactionId}`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.httpStatusCode || sdkResponse.httpStatusCode >= 400) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to put transaction for transaction id: ${transactionId}`);
        return Promise.reject(sdkResponse);
    }

    const castedSdkResponse: ApiResponse<Transaction> = sdkResponse as ApiResponse<Transaction>;

    logger.debug(`Received transaction ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(castedSdkResponse);
};
