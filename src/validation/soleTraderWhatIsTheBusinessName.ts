import { body } from "express-validator";

const businessNameFormat:RegExp = /^[A-Za-z0-9\-&'.\s]*$/;

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
