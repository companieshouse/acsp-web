import { Request } from "express";

export interface CompanyDetails {
    "company_name": string;
    "company_number": string;
    "company_status": string;
    "date_of_creation": string;
    "type": string;
    "registered_office_address": object;
    "undeliverable_registered_office_address": string;
}

export interface requiredCompanyDetails {
    companyName: string;
    companyNumber: string;
    status: string;
    incorporationDate: string;
    companyType: string;
    registeredOfficeAddress: object;
    correspondenceAddress: string;
}

export class CompanyDetailsService {
    private readonly sessionKey = "companyDetails";

    public saveToSession (req: Request, details: CompanyDetails): void {
        const requiredDetails: requiredCompanyDetails = {
            companyName: details.company_name,
            companyNumber: details.company_number,
            status: details.company_status,
            incorporationDate: details.date_of_creation,
            companyType: details.type,
            registeredOfficeAddress: details.registered_office_address,
            correspondenceAddress: details.undeliverable_registered_office_address
        };
        req.session[this.sessionKey] = requiredDetails;
        req.session.save();
    }

    public getFromSession (req: Request): CompanyDetails | undefined {
        return (req.session[this.sessionKey] as CompanyDetails) || undefined;
    }

    public clearSession (req: Request): void {
        delete req.session[this.sessionKey];
        req.session.save();
    }
}
