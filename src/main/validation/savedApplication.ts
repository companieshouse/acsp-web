import { body } from "express-validator";

export const selectSavedApplicationValidator = [
    body("savedApplication", "savedNoInputError").notEmpty()
];
