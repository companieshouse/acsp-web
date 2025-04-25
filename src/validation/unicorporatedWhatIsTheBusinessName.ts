import { Session } from "@companieshouse/node-session-handler";
import { body } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { trimAndLowercaseString, isLimitedBusinessType, getBusinessName } from "../services/common";
import { ACSP_DETAILS } from "../common/__utils/constants";

const businessNameFormat: RegExp = /^[A-Za-z0-9\-&'.\s]*$/;

export const unicorporatedWhatIsTheBusinessNameValidator = [

    body("whatIsTheBusinessName").trim().notEmpty().withMessage((value, { req }) => {
        const session: Session = req.session as Session;
        const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

        if (acspDetails && isLimitedBusinessType(acspDetails.type)) {
            return "whatIsTheCompanyNameNoNameUpdateAcspLtd";
        }
        return "whatIsTheBusinessNameNoName";
    }).bail()
        .matches(businessNameFormat).withMessage("whatIsTheBusinessNameInvalidCharacters").bail()
        .isLength({ max: 155 }).withMessage("whatIsTheBusinessNameCharactersLimit").bail()
        .custom((value, { req }) => {
            // Custom validation used for Update ACSP Details service
            // Check if the business name has changed through comparing the inputted business against the existing business name
            const session: Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

            if (acspDetails) {
                const normalisedBusinessName = trimAndLowercaseString(value);
                const existingBusinessName = trimAndLowercaseString(getBusinessName(acspDetails.name));

                if (normalisedBusinessName === existingBusinessName && isLimitedBusinessType(acspDetails.type)) {
                    throw new Error("whatIsTheCompanyNameNoChangeUpdateAcspLtd");
                } else if (normalisedBusinessName === existingBusinessName) {
                    throw new Error("whatIsTheBusinessNameNoChangeUpdateAcsp");
                }
            }
            return true;
        })
];
