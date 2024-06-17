import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { StatusCodes } from "http-status-codes";
import logger from "../../../lib/Logger";
import { createPublicApiKeyClient } from "../api/api_service";
import { Session } from "@companieshouse/node-session-handler";

/**
 * Get the profile for a company.
 *
 * @param companyNumber the company number to look up
 */
export const getCompanyProfile = async (session: Session, companyNumber: string): Promise<CompanyProfile> => {
    const apiClient = createPublicApiKeyClient();

    const sdkResponse: Resource<CompanyProfile> = await apiClient.companyProfile.getCompanyProfile(companyNumber);

    if (!sdkResponse) {
        logger.error(`Company profile API for company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to get company profile for company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.resource) {
        logger.error(`Company profile API returned no resource for company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    logger.info(`Received company profile ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource);
};
