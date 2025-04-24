import { body, ValidationChain } from "express-validator";

export type AddressListValidationType = "registration" | "update";

export const correspondenceAddressListValidator = (type: AddressListValidationType): ValidationChain[] => [
    body("correspondenceAddress", type === "registration" ? "correspondenceLookUpAddresListNoRadioBtnSelected" : "correspondenceLookUpAddresListNoRadioBtnSelectedUpdate").notEmpty()
];
