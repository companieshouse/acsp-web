import { body } from "express-validator";
import { BUSINESS_NAME_EXCLUDED_CHARS, LETTERS, NUMBERS, PUNCTUATION, SYMBOLS, WHITESPACE } from "./regexParts";

const businessNamePattern = `^(?!.*[${BUSINESS_NAME_EXCLUDED_CHARS}])[${LETTERS}${NUMBERS}${PUNCTUATION}${SYMBOLS}${WHITESPACE}]*$`;
const businessNameFormat: RegExp = new RegExp(businessNamePattern, "u");

export const soleTraderWhatIsTheBusinessNameValidator = [

    body("whatIsTheBusinessNameInput").trim().custom((value, { req }) => {
        if (req.body.whatsTheBusinessNameRadio === "A Different Name" && value === "") {
            throw new Error("whatIsTheBusinessNameNoName");

        }
        return true;
    }).bail()
        .matches(businessNameFormat).withMessage("whatIsTheBusinessNameInvalidCharacters").bail()
        .isLength({ max: 155 }).withMessage("whatIsTheBusinessNameCharactersLimit"),

    body("whatsTheBusinessNameRadio", "whatIsTheBusinessNameSelectRadio").notEmpty()
];
