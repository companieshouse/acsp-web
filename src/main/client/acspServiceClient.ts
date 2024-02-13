import { Request, Response, NextFunction } from "express";
import Axios, { AxiosInstance } from "axios";
import logger from "../../../lib/Logger";
import { getAccessToken } from "../common/__utils/session";
// import {
//     ACSP_SERVICE_TRANSACTION_URI
//   } from "../config";

import { Session } from "@companieshouse/node-session-handler";

export class ACSPServiceClient {

  client: AxiosInstance;

  constructor (baseURL: string) {
      this.client = Axios.create({ baseURL });
  }

  getConfig (session: Session) {
      return {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAccessToken(session)}`
          }
      };
  }

  async startTransaction (req: Request, session: Session) {
      try {
          const config = this.getConfig(session);
          const authToken = getAccessToken(session);
          const response = await this.client.post("/transactions", config);
          logger.info("response");
      } catch (err : any) {
          logger.info(err);
      }

  }

}

// export const startPaymentsSession = async (
//   req: Request,
//   session: Session
//   baseURL?: string
// ): Promise<string> => {

//   setExtraData(session, {
//     ...getApplicationData(session),
//     [Transactionkey]: transactionId,
//     [OverseasEntityKey]: overseasEntityId
//   });

//   const paymentUrl = transactionRes.headers?.[PAYMENT_REQUIRED_HEADER];

//   if (!paymentUrl) {
//     // Only if transaction does not have a fee
//     let confirmationPageUrl = CONFIRMATION_URL;

//     // TODO Remove this and the check for being on the registration journey when ids are in the Update journey URLs
//     const isRegistration: boolean = req.path.startsWith(LANDING_URL);

//     if (isActiveFeature(FEATURE_FLAG_ENABLE_REDIS_REMOVAL) && isRegistration){
//       confirmationPageUrl = getUrlWithParamsToPath(CONFIRMATION_WITH_PARAMS_URL, req);
//     }

//     return confirmationPageUrl;
//   }

//   const createPaymentRequest: CreatePaymentRequest = setPaymentRequest(transactionId, overseasEntityId, baseURL);

//   // Save info into the session extra data field, including the state used as `nonce` against CSRF.
//   setApplicationData(session, createPaymentRequest, PaymentKey);

//   // Create Payment Api Client by using the `paymentUrl` as baseURL
//   const apiClient: ApiClient = createOAuthApiClient(session, paymentUrl);

//   // Calls the platform to create a payment session
//   const paymentResult = await apiClient.payment.createPaymentWithFullUrl(createPaymentRequest);

//   // Verify the state of the payment, success or failure (eg. cost not found, connection issues ...)
//   if (paymentResult.isFailure()) {
//     const errorResponse = paymentResult.value;

//     const msgErrorStatusCode = `http response status code=${ errorResponse?.httpStatusCode || "No Status Code found in response" }`;
//     const msgErrorResponse = `http errors response=${ JSON.stringify(errorResponse?.errors || "No Errors found in response") }`;
//     const msgError = `payment.service failure to create payment, ${msgErrorStatusCode}, ${msgErrorResponse}.`;

//     throw createAndLogErrorRequest(req, msgError);
//   } else if (!paymentResult.value?.resource) {
//     throw createAndLogErrorRequest(req, "No resource in payment response");
//   } else {
//     const paymentResource: Payment = paymentResult.value.resource;

//     logger.infoRequest(req, `Create payment, status_code=${ paymentResult.value.httpStatusCode }, status=${ paymentResource.status }, links= ${ JSON.stringify(paymentResource.links ) } `);

//     // To initiate the web journey through which the user will interact to make the payment
//     return paymentResource.links.journey;
//   }
// };
