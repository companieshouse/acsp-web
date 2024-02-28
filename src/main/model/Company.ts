import { Address } from "./Address";

export interface Company {
    companyName?: string,
    companyNumber?: string,
    status?: string,
    incorporationDate?: string,
    companyType?: string,
    registeredOfficeAddress?: object,
    correspondenceAddress?: string
}
