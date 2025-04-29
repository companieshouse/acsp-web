import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { body, ValidationChain } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { trimAndLowercaseString } from "../services/common";
import { Request } from "express-validator/src/base";

type EmailValidationType = "registration" | "update";

export const whatIsYourEmailValidator = (type: EmailValidationType): ValidationChain[] => [

    body("whatIsYourEmailInput").trim().if(body("whatIsYourEmailRadio").equals("A Different Email"))
        .notEmpty().withMessage(type === "registration" ? "noEmail" : "noCorrespondenceEmail").bail()
        .isEmail().withMessage("emailFormatIncorrect").bail()
        .custom((input, { req }) => compareNewOldEmailChecker(req, input)).withMessage("emailNoChangeUpdateAcsp"),

    body("whatIsYourEmailRadio", type === "registration" ? "noEmail" : "emailNoChange").notEmpty().bail()
        .custom((value, { req }) => compareNewOldEmailChecker(req, value)).withMessage("emailNoChange")
];

const compareNewOldEmailChecker = (req: Request, value: string) => {
    // Custom validation used for Update ACSP Details service,
    // Check if the email has changed through comparing the inputted email against the existing email
    const session : Session = req.session as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

    if (acspDetails) {
        // Trim leading and trailing spaces, convert email to lowercase
        // and replace multiple spaces with a single space
        const normalisedInput = trimAndLowercaseString(value);
        const existingEmail = trimAndLowercaseString(acspDetails.email);
        // Check if the email has changed
        // If the email is the same as the existing email, throw an error
        if (normalisedInput === existingEmail) {
            throw new Error();
        }
    }
    return true;
};
