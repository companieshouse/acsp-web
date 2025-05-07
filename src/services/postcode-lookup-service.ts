import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";
import logger, { createAndLogError } from "../utils/logger";
import { Resource } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { createPublicApiKeyClient } from "./apiService";
import { POSTCODE_ADDRESSES_LOOKUP_URL } from "../utils/properties";

export const getUKAddressesFromPostcode = async (postcode: string): Promise<UKAddress[]> => {
    const apiClient: ApiClient = createPublicApiKeyClient();
    logger.debug(`Retrieving UK addresses for postcode ${postcode}`);
    const postcodeLookUpUrl = `${POSTCODE_ADDRESSES_LOOKUP_URL}/multiple-addresses`;
    const castedSdkResponse: Resource<UKAddress[]> = await apiClient.postCodeLookup.getListOfValidPostcodeAddresses(postcodeLookUpUrl, postcode);

    if (!castedSdkResponse.resource) {
        throw createAndLogError(`Failed to get UK addresses for postcode ${postcode}`);
    }

    logger.debug(`Retrieved UK addresses for postcode ${postcode}`);
    return castedSdkResponse.resource
        .sort((a, b) => (a.premise > b.premise) ? 1 : -1);
};

export async function getAddressFromPostcode (postcode: string) {
    postcode = postcode.replace(/\s/g, "");
    const ukAddresses = await getUKAddressesFromPostcode(postcode);
    if (!ukAddresses.length) {
        throw Error("Postcode not found");
    }
    return ukAddresses;
}
