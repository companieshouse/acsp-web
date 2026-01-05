import { Request } from "express";
import { COMPANY_DETAILS, COMPANY_NUMBER } from "../../common/__utils/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { Session } from "@companieshouse/node-session-handler";
import { Company } from "../../model/Company";
import { formatDateIntoReadableString } from "../../services/common";

export class CompanyDetailsService {
    public saveToSession (req: Request, details: CompanyProfile): void {
        const session: Session = req.session as any as Session;

        const requiredDetails: Company = {
            companyName: details.companyName,
            companyNumber: details.companyNumber,
            status: this.capFirstLetter(details.companyStatus || ""),
            incorporationDate: formatDateIntoReadableString(new Date(details.dateOfCreation)),
            companyType: this.determineCompanyType(details.type),
            registeredOfficeAddress: details.registeredOfficeAddress
        };

        if (session) {
            session.setExtraData(COMPANY_DETAILS, requiredDetails);
            session.setExtraData(COMPANY_NUMBER, details.companyNumber);
        }
    }

    public determineCompanyType (type: string): string {
        if (!type) return "";

        const companyTypeFormat = /[^\w\s]/gi;
        const cleanedCompanyType = type.replace(companyTypeFormat, "");
        let companyType;
        switch (cleanedCompanyType.toUpperCase()) {
        case "PLC":
            companyType = "Public Limited Company";
            break;
        case "LTD":
            companyType = "Private Limited Company";
            break;
        case "LP":
            companyType = "Limited Partnership";
            break;
        case "LLP":
            companyType = "Limited Liability Partnership";
            break;
        default:
            companyType = type.replace(companyTypeFormat, " ");
        }
        return companyType;

    }

    public capFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
}
