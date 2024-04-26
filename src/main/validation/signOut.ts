import { body } from "express-validator";

export const selectsignOutValidator = [
    body("sign-out", "signoutNoInputError").notEmpty()
];
