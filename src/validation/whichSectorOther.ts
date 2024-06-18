import { body } from "express-validator";

export const whichSectorOtherValidator = [
    body("whichSectorOther", "whichSectorOtherSelectRadio").notEmpty()
];
