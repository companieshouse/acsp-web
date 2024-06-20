import { createPaymentApiClient, createPublicApiKeyClient } from "../../../src/services/api-services";

describe("API Service test suite", () => {
    test("createPublicApiKeyClient should return a new API Client, to use api key for authentication", () => {
        const apiClientResponse = createPublicApiKeyClient();
        expect(apiClientResponse).not.toBeNull();
    });
});
