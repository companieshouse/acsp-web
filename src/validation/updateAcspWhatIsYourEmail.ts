import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { body } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";

export const updateAcspWhatIsYourEmailValidator = [

    body("whatIsYourEmailInput").trim().if(body("whatIsYourEmailRadio").equals("A Different Email"))
        .notEmpty().withMessage("noCorrespondenceEmail").bail()
        .isEmail().withMessage("emailFormatIncorrect").custom((input, { req }) => {
            // Custom validation used for Update ACSP Details service,
            // Check if the email has changed through comparing the inputted email against the existing email
            const session : Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

            if (acspDetails) {
                // Trim leading and trailing spaces, convert email to lowercase
                // and replace multiple spaces with a single space
                const normalisedInput = input.trim().toLowerCase().replace(/\s+/g, " ");
                const existingEmail = acspDetails.email.trim().toLowerCase().replace(/\s+/g, " ");
                if (normalisedInput === existingEmail) {
                    throw new Error("emailNoChangeUpdateAcsp");
                }
            } return true;
        }),

    body("whatIsYourEmailRadio", "emailNoChange").notEmpty().custom((value, { req }) => {

        // Custom validation used for Update ACSP Details service,
        // Check if the email has changed through comparing the inputted email against the existing email
        const session : Session = req.session as Session;
        const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

        if (acspDetails) {
            // Trim leading and trailing spaces, convert email to lowercase
            // and replace multiple spaces with a single space
            const normalisedInput = value.trim().toLowerCase().replace(/\s+/g, " ");
            const existingEmail = acspDetails.email;
            // Check if the email has changed
            // If the email is the same as the existing email, throw an error
            if (normalisedInput === existingEmail) {
                throw new Error("emailNoChange");
            }
        }
        return true;
    })
];
