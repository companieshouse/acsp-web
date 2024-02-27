import { Address } from "./Address";

import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";

export interface UserData {
    firstName: string;
    lastName: string;
    addresses?: Array<Address>;
}
