import { AMLSupervisoryBodies } from "./AMLSupervisoryBodies";
import { Address } from "./Address";
import { Company } from "./Company";
import { Nationality } from "./Nationality";
import { RoleType } from "./RoleType";
import { SectorOfWork } from "./SectorOfWork";
import { TypeOfBusiness } from "./TypeOfBusiness";

export interface ACSPData {
    firstName?: string;
    lastName?: string;
    addresses?: Array<Address>;
    typeofBusiness? : TypeOfBusiness;
    roleType? : RoleType;
    dateOfBirth? : Date;
    verified? : Boolean;
    nationality? : Array<Nationality>;
    countryOfResidence? : string;
    businessName?: string;
    workSector?: SectorOfWork;
    amlSupervisoryBodies?: Map<AMLSupervisoryBodies, number>;
    companyDetails?: Company;
    companyAuthCodeProvided?: boolean;
}
