import { body } from "express-validator";

export const nameRegisteredWithAmlValidator = [
    body("nameRegisteredWithAml", "nameRegisteredWithAmlSelectRadio").notEmpty()
];
