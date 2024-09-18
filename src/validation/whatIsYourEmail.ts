import { body } from "express-validator";

export const whatIsYourEmailValidator = [

    body("whatIsYourEmailInput").trim().if(body("whatIsYourEmailRadio").equals("A Different Email"))
        .notEmpty().withMessage("noEmail").bail()
        .isEmail().withMessage("emailFormatIncorrect"),

    body("whatIsYourEmailRadio", "noEmail").notEmpty()
];
