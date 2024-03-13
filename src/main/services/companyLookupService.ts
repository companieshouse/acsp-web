import { StatusCodes } from "http-status-codes";
import logger from "../../../lib/Logger";
import { GenericService } from "./generic";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "./company/company_profile_service";

export class CompanyLookupService extends GenericService {
    constructor () {
        super();
        this.viewData.title = "You cannot use this service";
        this.viewData.title = "";
    }

    async getCompany (companyNumber: string): Promise<CompanyProfile> {
        let companyProfile: CompanyProfile;
        try {
            logger.info("going to get Company Profile ---> ");
            companyProfile = await getCompanyProfile(companyNumber);
            logger.info("Company Profile ---> " + JSON.stringify(companyProfile));
            return Promise.resolve(companyProfile);
        } catch (err) {
            logger.error(`register acsp: ${StatusCodes.INTERNAL_SERVER_ERROR} - error while getting company details`);
            const errorData = this.processServiceException(err);
            return Promise.reject(errorData);
        }
    }
}
