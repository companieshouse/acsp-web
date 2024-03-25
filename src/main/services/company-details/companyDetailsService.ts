import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { COMPANY_DETAILS } from "../../common/__utils/constants";
import { Company } from "../../model/Company";

export class CompanyDetailsService {
    private readonly sessionKey = "companyDetails";

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
        // saveDataInSession(req, COMPANY_DETAILS, requiredDetails);
        if (session) {
            session.setExtraData(COMPANY_DETAILS, requiredDetails);
        }
    }
}
