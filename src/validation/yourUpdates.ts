import { body } from "express-validator";

export const yourUpdatesValidator = [
    body("moreUpdates", "yourUpdatesNoInputError").notEmpty()
];
