import { Nationality } from "./Nationality";
import { Address } from "./Address";

export interface ApplicantDetails {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: Date;
  nationality?: Nationality;
  countryOfResidence?: string;
  correspondenceAddress?: Address;
  correspondenceAddressIsSameAsRegisteredOfficeAddress?: boolean;
}
