import { Session } from "@companieshouse/node-session-handler";
import { body } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS } from "../common/__utils/constants";

const businessNameFormat:RegExp = /^[A-Za-z0-9\-&'.\s]*$/;

export const unicorporatedWhatIsTheBusinessNameValidator = [

    body("whatIsTheBusinessName").trim().notEmpty().withMessage("whatIsTheBusinessNameNoName").bail()
        .matches(businessNameFormat).withMessage("whatIsTheBusinessNameInvalidCharacters").bail()
        .isLength({ max: 155 }).withMessage("whatIsTheBusinessNameCharactersLimit").bail()
        .custom((inputBusinessName, { req }) => {
            // Custom validation used for Update ACSP Details service
            // Check if the business name has changed through comparing the inputted business against the existing business name
            const session = req.session as any as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

            if (acspDetails) {
                // Trim leading and trailing spaces, convert business name to lowercase, and replace multiple spaces with a single space
                const normalisedBusinessName = inputBusinessName.trim().toLowerCase().replace(/\s+/g, " ");
                const existingBusinessName = acspDetails.name.trim().toLowerCase().replace(/\s+/g, " ");

                if (normalisedBusinessName === existingBusinessName) {
                    throw new Error("whatIsTheBusinessNameNoChangeUpdateAcsp");
                }
            }
            return true;
        })
];
