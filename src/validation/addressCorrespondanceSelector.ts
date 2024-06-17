import { body } from "express-validator";

export const addressCorrespondanceSelectorValidator = [
    body("addressSelectorRadio", "addressSelectorSelectionRadio").notEmpty()
];
