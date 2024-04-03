import { body } from "express-validator";

export const addressCorrespondanceSelectorValidator = [
    body("businessAddress", "businessLookUpAddresListNoRadioBtnSelected").notEmpty()
];
