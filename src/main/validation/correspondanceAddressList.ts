import { body } from "express-validator";

export const correspondenceAddressListValidator = [
    body("correspondenceAddress", "correspondenceLookUpAddresListNoRadioBtnSelected").notEmpty()
];
