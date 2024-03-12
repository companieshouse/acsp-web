import { ServiceAddress } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";

export interface Company {
    companyName?: string,
    companyNumber?: string,
    status?: string,
    incorporationDate?: string,
    companyType?: string,
    registeredOfficeAddress?: object,
    correspondenceAddress?: ServiceAddress
}
