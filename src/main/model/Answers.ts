import { Address } from "./Address";

export interface Answers{
    typeofBusiness? : string;
    roleType? : string;
    name?: string;
    dateOfBirth? : Date;
    nationality? : Array<string>;
    countryOfResidence? : string;
    businessName?: string;
    workSector?: string;
    correspondenceAddress?: string;
    businessAddress?: string;
    companyNumber?: string;
    nameRegisteredWithAML?: string;
}
