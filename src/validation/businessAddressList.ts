import { body } from "express-validator";

export const businessAddressListValidator = [
    body("businessAddress", "businessLookUpAddresListNoRadioBtnSelected").notEmpty()
];
