import { body, ValidationChain } from "express-validator";
import { AddressListValidationType } from "./correspondanceAddressList";

export const businessAddressListValidator = (type: AddressListValidationType): ValidationChain[] => [
    body("businessAddress", type === "registration" ? "businessLookUpAddresListNoRadioBtnSelected" : "businessLookUpAddresListNoRadioBtnSelectedUpdate").notEmpty()
];
