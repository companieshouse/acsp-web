import { body } from "express-validator";

export const sectorYouWorkInValidator = [
    body("sectorYouWorkIn", "sectorYouWorkInSelectRadio").notEmpty()
];
