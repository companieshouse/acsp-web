import { API_URL, CHS_API_KEY } from "../../utils/properties";
import { createApiClient } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";

export const createPublicApiKeyClient = (): ApiClient => {
    return createApiClient(CHS_API_KEY, undefined, API_URL);
};

export const getPostcode = () => {
    const api = createApiClient("your-api-key");
    const profile = api.postCodeLookup.getListOfValidPostcodeAddresses;

    console.log(profile);
};
