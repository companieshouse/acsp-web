export interface AmlDetails {
    supervisoryBody: string;
    membershipDetails: string;
    dateOfChange?: Date | string;
}
export interface Address {
    careOf?: string;
    addressLine1?: string;
    addressLine2?: string;
    country?: string;
    locality?: string;
    poBox?: string;
    postalCode?: string;
    premises?: string;
    region?: string;
}
export interface SoleTraderDetails {
    forename?: string;
    otherForenames?: string;
    surname?: string;
    nationality?: string;
    usualResidentialCountry?: string;
    dateOfBirth?: Date;
}

export interface AcspFullProfile {
    number: string;
    name: string;
    status: string;
    type: string;
    businessSector?: string;
    notifiedFrom: Date;
    deauthorisedFrom?: Date;
    email: string;
    amlDetails: AmlDetails[];
    registeredOfficeAddress: Address;
    serviceAddress?: Address;
    soleTraderDetails?: SoleTraderDetails;
}

export interface Errors {
    errors: Error[];
}

export type AcspFullProfileResponse = AcspFullProfile | Errors;
