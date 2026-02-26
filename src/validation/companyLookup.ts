import { body } from "express-validator";

const characterPattern: RegExp = /^[a-zA-Z0-9]+$/;
export const companyNumberValidator = [
    body("companyNumber").trim().notEmpty().withMessage("invalidcompanyNumberNoData").bail()
        .matches(characterPattern).withMessage("invalidcompanyNumberPattern").bail()
        .isLength({ min: 8, max: 8 }).withMessage("invalidcompanyNumbercharacterLimit").bail()
];
