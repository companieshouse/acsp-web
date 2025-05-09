import { body } from "express-validator";

export const whatWillHappenValidator = [
    body("whatWillHappenConfirm", "whatWillHappenNoSelection").notEmpty()
];
