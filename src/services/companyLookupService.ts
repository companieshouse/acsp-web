import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";
import { Request } from "express";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "./company/company_profile_service";
import { CompanyDetailsService } from "./company-details/companyDetailsService";

export class CompanyLookupService {

    async getCompany (companyNumber: string): Promise<CompanyProfile> {
        let companyProfile: CompanyProfile;
        try {
            logger.info("going to get Company Profile ---> ");
            companyProfile = await getCompanyProfile(companyNumber.toUpperCase());
            logger.info("Company Profile ---> " + JSON.stringify(companyProfile));
            return Promise.resolve(companyProfile);
        } catch (error) {
            logger.error(`register acsp: ${StatusCodes.INTERNAL_SERVER_ERROR} - error while getting company details`);
            return Promise.reject(error);
        }
    }

    async getCompanyDetails (companyNumber: string, req: Request) {
        await this.getCompany(companyNumber).then(
            (companyDetails) => {
                const companyDetailsService = new CompanyDetailsService();
                companyDetailsService.saveToSession(req, companyDetails);
            }).catch(() => {
            throw Error("Company Not Found");
        });

    }
}
