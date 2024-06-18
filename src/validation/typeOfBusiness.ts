import { body } from "express-validator";

export const typeOfBusinessValidator = [
    body("typeOfBusinessRadio", "typeOfBusinessSelectRadio").notEmpty()
];
