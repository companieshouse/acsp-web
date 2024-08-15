import { AMLSupervisoryBodies } from "./AMLSupervisoryBodies";
import { Address } from "./Address";
import { Company } from "./Company";
import { Nationality } from "./Nationality";
import { RoleType } from "./RoleType";
import { SectorOfWork } from "./BusinessSector";
import { TypeOfBusiness } from "./TypeOfBusiness";

export interface ACSPData {
    id: string;
    firstName?: string;
    lastName?: string;
    addresses?: Array<Address>;
    address?: Address;
    typeOfBusiness? : TypeOfBusiness;
    roleType? : RoleType;
    dateOfBirth? : Date;
    verified? : boolean;
    nationality? : Array<Nationality>;
    countryOfResidence? : string;
    businessName?: string;
    registeredOfficeAddress?: Address;
    workSector?: SectorOfWork;
    amlSupervisoryBodies?: Map<AMLSupervisoryBodies, number>;
    companyDetails?: Company;
    companyAuthCodeProvided?: boolean;
}
