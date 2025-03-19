import { Resource } from "@companieshouse/api-sdk-node";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";
import { StatusCodes } from "http-status-codes";
import { REFERENCE } from "../../src/config";

export const transactionId: string = "7218I-HJSW9W-UWNX0-IW9SO";

export const validTransaction: Transaction = {
    id: transactionId,
    reference: REFERENCE,
    companyName: "TEST-COMPANY-123",
    companyNumber: "1234567",
    createdAt: "27/10/2008",
    createdBy: {
        language: "tester",
        id: "test123",
        email: "test@email.test"
    },
    description: "Mandatory transaction description"
};

export const mockOpenTransaction: Transaction = {
    id: "119709-207817-181835",
    status: "open",
    reference: REFERENCE,
    description: "Mandatory transaction description",
    resources: {
        "/transactions/119709-207817-181835/authorised-corporate-service-provider-applications/Y2VkZWVlMzhlZWFjY2M4MzQ3MT": {
            kind: "acsp",
            links: {
                resource: ""
            }
        }
    }
};

export const mockClosedPendingPaymentTransaction: Transaction = {
    id: "119709-207817-181835",
    status: "closed pending payment",
    reference: REFERENCE,
    description: "Mandatory transaction description"
};

export const validTransactionSDKResource: Resource<Transaction> = {
    httpStatusCode: StatusCodes.OK,
    resource: validTransaction
};
