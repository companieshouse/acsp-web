import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { COMPANY_DETAILS } from "../../common/__utils/constants";
import { Company } from "../../model/Company";

export interface CompanyDetails {
    "company_name": string;
    "company_number": string;
    "company_status": string;
    "date_of_creation": string;
    "type": string;
    "registered_office_address": object;
    "undeliverable_registered_office_address": string;
}

export class CompanyDetailsService {
    private readonly sessionKey = "companyDetails";

    public saveToSession (req: Request, details: CompanyDetails): void {
        const session: Session = req.session as any as Session;
        const requiredDetails: Company = {
            companyName: details.company_name,
            companyNumber: details.company_number,
            status: details.company_status,
            incorporationDate: details.date_of_creation,
            companyType: details.type,
            registeredOfficeAddress: details.registered_office_address,
            correspondenceAddress: details.undeliverable_registered_office_address
        };// saveDataInSession(req, COMPANY_DETAILS, requiredDetails);
        if (session) {
            session.setExtraData(COMPANY_DETAILS, requiredDetails);
        }
        console.log(requiredDetails);
    }
}
