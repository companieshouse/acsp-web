import { AMLSupervisoryBodies } from "./AMLSupervisoryBodies";
import { Address } from "./Address";
import { Company } from "./Company";
import { RoleType } from "./RoleType";
import { SectorOfWork } from "./BusinessSector";
import { TypeOfBusiness } from "./TypeOfBusiness";
import { ApplicantDetails } from "./ApplicantDetails";
import { AcspType } from "./AcspType";

export interface ACSPData {
    id: string;
    addresses?: Array<Address>;
    address?: Address;
    typeOfBusiness?: TypeOfBusiness;
    roleType?: RoleType;
    verified?: boolean;
    businessName?: string;
    registeredOfficeAddress?: Address;
    workSector?: SectorOfWork;
    amlSupervisoryBodies?: Map<AMLSupervisoryBodies, number>;
    companyDetails?: Company;
    companyAuthCodeProvided?: boolean;
    applicantDetails?: ApplicantDetails;
    acspType?: AcspType;
}
