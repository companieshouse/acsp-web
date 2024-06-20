import { createPublicApiKeyClient, createPublicApiKeyClientWithToken, createPublicOAuthApiClient } from "../../../../src/services/api/api_service";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";

const session = getSessionRequestWithPermission();

describe("API Service tests", () => {

    it("should return a new API Client, to use api key for authentication", () => {
        const apiClientResponse = createPublicOAuthApiClient(session);
        expect(apiClientResponse).not.toBeNull();
    });

    it("should return a new API Client, to use api key for authentication", () => {
        const apiClientResponse = createPublicApiKeyClient();
        expect(apiClientResponse).not.toBeNull();
    });

    it("should return a new API Client with token", () => {
        const apiClientResponse = createPublicApiKeyClientWithToken("token");
        expect(apiClientResponse).not.toBeNull();
    });
});
