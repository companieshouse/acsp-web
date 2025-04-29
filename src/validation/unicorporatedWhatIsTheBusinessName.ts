import { Session } from "@companieshouse/node-session-handler";
import { body } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { trimAndLowercaseString, isLimitedBusinessType, getBusinessName } from "../services/common";
import { ACSP_DETAILS } from "../common/__utils/constants";

const businessNameFormat: RegExp = /^[A-Za-z0-9\-&'.\s]*$/;

export const unicorporatedWhatIsTheBusinessNameValidator = [

    body("whatIsTheBusinessName").trim().notEmpty().withMessage((value, { req }) => {
        const { acspDetails } = getAcspDetails(req);

        if (acspDetails && isLimitedBusinessType(acspDetails.type)) {
            return "whatIsTheCompanyNameNoNameUpdateAcspLtd";
        }
        return "whatIsTheBusinessNameNoName";
    }).bail()
        .matches(businessNameFormat).withMessage((value, { req }) => {
            const { acspDetails } = getAcspDetails(req);

            if (acspDetails && isLimitedBusinessType(acspDetails.type)) {
                return "whatIsTheCompanyNameInvalidCharactersUpdateAcspLtd";
            }
            return "whatIsTheBusinessNameInvalidCharacters";
        }).bail()
        .isLength({ max: 155 }).withMessage((value, { req }) => {
            const { acspDetails } = getAcspDetails(req);

            if (acspDetails && isLimitedBusinessType(acspDetails.type)) {
                return "whatIsTheCompanyNameCharactersLimitUpdateAcspLtd";
            }
            return "whatIsTheBusinessNameCharactersLimit";
        }).bail()
        .custom((value, { req }) => {
            return businessNameNoChangeValidation(value, req);
        })
];

const businessNameNoChangeValidation = (input: string, req: any): boolean => {
    const { acspDetails } = getAcspDetails(req);

    if (acspDetails) {
        const inputBusinessName = trimAndLowercaseString(input);
        const existingBusinessName = trimAndLowercaseString(getBusinessName(acspDetails.name));

        if (inputBusinessName === existingBusinessName && isLimitedBusinessType(acspDetails.type)) {
            throw new Error("whatIsTheCompanyNameNoChangeUpdateAcspLtd");
        } else if (inputBusinessName === existingBusinessName) {
            throw new Error("whatIsTheBusinessNameNoChangeUpdateAcsp");
        }
    }
    return true;
};

const getAcspDetails = (req: any): { session: Session; acspDetails?: AcspFullProfile } => {
    const session: Session = req.session as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
    return { session, acspDetails };
}; ;
