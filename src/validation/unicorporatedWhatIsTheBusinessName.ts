import { Session } from "@companieshouse/node-session-handler";
import { body, ValidationChain } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { trimAndLowercaseString, getBusinessName } from "../services/common";
import { ACSP_DETAILS } from "../common/__utils/constants";

const businessNameFormat: RegExp = /^[A-Za-z0-9\-&'.\s]*$/;
type BusinessNameType = "businessName" | "companyName";

export const unicorporatedWhatIsTheBusinessNameValidator = (type: BusinessNameType): ValidationChain[] => [

    body("whatIsTheBusinessName").trim().notEmpty().withMessage(type === "companyName" ? "whatIsTheCompanyNameNoNameUpdateAcspLtd" : "whatIsTheBusinessNameNoName").bail()
        .matches(businessNameFormat).withMessage(type === "companyName" ? "whatIsTheCompanyNameInvalidCharactersUpdateAcspLtd" : "whatIsTheBusinessNameInvalidCharacters").bail()
        .isLength({ max: 155 }).withMessage(type === "companyName" ? "whatIsTheCompanyNameCharactersLimitUpdateAcspLtd" : "whatIsTheBusinessNameCharactersLimit").bail()
        .custom((value, { req }) => businessNameNoChangeValidation(value, req, type))
];

const businessNameNoChangeValidation = (input: string, req: any, type: BusinessNameType): boolean => {
    const session: Session = req.session as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);

    if (acspDetails) {
        const inputBusinessName = trimAndLowercaseString(input);
        const existingBusinessName = trimAndLowercaseString(getBusinessName(acspDetails.name));

        if (inputBusinessName === existingBusinessName && type === "companyName") {
            throw new Error("whatIsTheCompanyNameNoChangeUpdateAcspLtd");
        } else if (inputBusinessName === existingBusinessName) {
            throw new Error("whatIsTheBusinessNameNoChangeUpdateAcsp");
        }
    }
    return true;
};
