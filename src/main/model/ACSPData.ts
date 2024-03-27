import { AMLSupervisoryBodies } from "./AMLSupervisoryBodies";
import { Address } from "./Address";
import { Company } from "./Company";
import { Nationality } from "./Nationality";
import { RoleType } from "./RoleType";
import { SectorOfWork } from "./SectorOfWork";
import { TypeOfBusiness } from "./TypeOfBusiness";

export interface ACSPData {
    id: string;
    firstName?: string;
    lastName?: string;
    addresses?: Array<Address>;
    typeofBusiness? : TypeOfBusiness;
    roleType? : RoleType;
    dateOfBirth? : Date;
    verified? : boolean;
    nationality? : Array<Nationality>;
    countryOfResidence? : string;
    businessName?: string;
    businessAddress?: Address;
    workSector?: SectorOfWork;
    amlSupervisoryBodies?: Map<AMLSupervisoryBodies, number>;
    companyDetails?: Company;
    companyAuthCodeProvided?: boolean;
}
