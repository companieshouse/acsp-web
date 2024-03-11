import { Address } from "./Address";

export interface UserData {
    firstName: string;
    lastName: string;
    addresses?: Array<Address>;
}
