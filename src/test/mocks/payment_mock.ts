import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";

export const PAYMENT_JOURNEY_URL = "journey";

export const dummyPayment = {
    amount: "13",
    availablePaymentMethods: ["methods"],
    companyNumber: "23213",
    completedAt: "2021-05-23",
    createdAt: "2021-05-23",
    createdBy: {
        email: "test@test.com",
        forename: "forename",
        id: "342423",
        surname: "testy"
    },
    description: "payment",
    etag: "34324",
    kind: "kind",
    links: {
        journey: PAYMENT_JOURNEY_URL
    },
    paymentMethod: "visa",
    reference: "3432",
    status: "paid"
} as Payment;
