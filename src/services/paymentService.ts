import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { CreatePaymentRequest, Payment } from "@companieshouse/api-sdk-node/dist/services/payment";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Session } from "@companieshouse/node-session-handler";
import logger, { createAndLogError } from "../utils/logger";
import { createPaymentApiClient } from "./apiService";
import { API_URL, CHS_URL } from "../utils/properties";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, PAYMENT_CALLBACK_URL } from "../types/pageURL";
import { PAYEMNT_REFERENCE } from "../common/__utils/constants";

export const startPaymentsSession = async (session: Session, paymentSessionUrl: string,
    transactionId: string): Promise<ApiResponse<Payment>> => {
    logger.debug("Starting payment session");
    const apiClient: ApiClient = createPaymentApiClient(session, paymentSessionUrl);
    const reference: string = PAYEMNT_REFERENCE + transactionId;
    const redirectUri: string = CHS_URL + BASE_URL + PAYMENT_CALLBACK_URL;
    const paymentResourceUri: string = `/transactions/${transactionId}/payment`;
    const resourceWithHost = API_URL + paymentResourceUri;

    const state = uuidv4();

    session.setExtraData("payment-nonce", state);

    const createPaymentRequest: CreatePaymentRequest = {
        redirectUri: redirectUri,
        reference: reference,
        resource: resourceWithHost,
        state: state
    };
    const paymentResult = await apiClient.payment.createPaymentWithFullUrl(createPaymentRequest);

    if (paymentResult.isFailure()) {
        const errorResponse = paymentResult.value;
        logger.error(`payment.service failure to create payment - http response status code = ${errorResponse?.httpStatusCode} - ${JSON.stringify(errorResponse?.errors)}`);
        if (errorResponse.httpStatusCode === 401 || errorResponse.httpStatusCode === 429) {
            throw createAndLogError(`payment.service Http status code ${errorResponse.httpStatusCode} - Failed to create payment,  ${JSON.stringify(errorResponse?.errors) || "Unknown Error"}`);
        } else {
            throw createAndLogError(`payment.service Unknown Error ${JSON.stringify(errorResponse?.errors) || "No Errors found in response"}`);
        }
    } else {
        logger.info(`Create payment, status_code=${paymentResult.value.httpStatusCode}`);
        return paymentResult.value;
    }
};
