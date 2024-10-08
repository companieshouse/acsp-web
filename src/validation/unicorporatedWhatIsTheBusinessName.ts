import { body } from "express-validator";

const businessNameFormat:RegExp = /^[A-Za-z0-9\-&'.\s]*$/;

export const unicorporatedWhatIsTheBusinessNameValidator = [

    body("whatIsTheBusinessName").trim().notEmpty().withMessage("whatIsTheBusinessNameNoName").bail()
        .matches(businessNameFormat).withMessage("whatIsTheBusinessNameInvalidCharacters").bail()
        .isLength({ max: 155 }).withMessage("whatIsTheBusinessNameCharactersLimit")
];
