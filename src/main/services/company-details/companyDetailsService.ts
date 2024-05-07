import { Request } from "express";
import { COMPANY_DETAILS, COMPANY_NUMBER } from "../../common/__utils/constants";
import { Company } from "../../model/Company";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { Session } from "@companieshouse/node-session-handler";

export class CompanyDetailsService {
    public saveToSession (req: Request, details: CompanyProfile): void {
        const session: Session = req.session as any as Session;
  
        const requiredDetails: Company = {
            companyName: details.companyName,
            companyNumber: details.companyNumber,
            status: details.companyStatus,
            incorporationDate: details.dateOfCreation,
            companyType: details.type,
            registeredOfficeAddress: details.registeredOfficeAddress,
            correspondenceAddress: details.serviceAddress
        };
        if (session) {
            session.setExtraData(COMPANY_DETAILS, requiredDetails);
            session.setExtraData(COMPANY_NUMBER, details.companyNumber);
        }
    }
}
