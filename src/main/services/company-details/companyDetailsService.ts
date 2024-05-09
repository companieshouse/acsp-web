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
            // status:details.companyStatus,
            status: this.capFirstLetter(details.companyStatus || ""),
            incorporationDate: this.formatDate(details.dateOfCreation),
            companyType: details.type,
            registeredOfficeAddress: details.registeredOfficeAddress,
            correspondenceAddress: details.serviceAddress
        };
        if (session) {
            session.setExtraData(COMPANY_DETAILS, requiredDetails);
            session.setExtraData(COMPANY_NUMBER, details.companyNumber);
        }
    }

    /* public determineCompanyType(type: string): string {
        let companyType: string;

        if (type === "plc") {
            companyType = "Public Limited Company"
        } else if (type === "Ltd") {
            companyType = "Private Limited Company"
        } else if (type === "LP") {
            companyType = "Limited Partnership"
        } else if (type === "LLP") {
            companyType = "Limited Liability Partnership"
        } else {
            companyType = type;
        }
        return companyType
    } */

    public capFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "2-digit" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", options);
    };
}
