import { body } from "express-validator";

export const otherTypeOfBusinessValidator = [
    body("otherTypeOfBusinessRadio", "otherTypeOfBusinessSelectRadio").notEmpty()
];
