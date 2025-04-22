import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { body } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

const nameFormat: RegExp = /^[a-zA-Z \-']*$/ig;
const spaceFormat: RegExp = /\s+/g;

export const nameValidator = [
    body("first-name").trim().notEmpty().withMessage("enterFirstName").bail().matches(nameFormat).withMessage("invalidFirstNameFormat").bail().isLength({ max: 50 })
        .withMessage("invalidFirstNameLength").bail().custom((value, { req }) => {
            const session = req.session as any as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
            if (acspDetails) {
                const originalFirstName = normaliseName(acspDetails.soleTraderDetails?.forename);
                const originalMiddleName = normaliseName(acspDetails.soleTraderDetails?.otherForenames);
                const originalSurname = normaliseName(acspDetails.soleTraderDetails?.surname);

                if (originalFirstName === normaliseName(value) && originalMiddleName === normaliseName(req.body["middle-names"]) && originalSurname === normaliseName(req.body["last-name"])) {
                    throw new Error("noChangeFirstname");
                }
            }
            return true;
        }),
    body("middle-names").trim().matches(nameFormat).withMessage("invalidMiddleNameFormat").bail().isLength({ max: 50 }).withMessage("invalidMiddleNameLength").bail()
        .custom((value, { req }) => {
            const session = req.session as any as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
            if (acspDetails) {
                const originalFirstName = normaliseName(acspDetails.soleTraderDetails?.forename);
                const originalMiddleName = normaliseName(acspDetails.soleTraderDetails?.otherForenames);
                const originalSurname = normaliseName(acspDetails.soleTraderDetails?.surname);

                if (originalFirstName === normaliseName(req.body["first-name"]) && originalMiddleName === normaliseName(value) && originalSurname === normaliseName(req.body["last-name"])) {
                    throw new Error("noChangeMiddleNames");
                }
            }
            return true;
        }),
    body("last-name").trim().notEmpty().withMessage("enterLastName").bail().matches(nameFormat).withMessage("invalidLastNameFormat").bail().isLength({ max: 160 })
        .withMessage("invalidLastNameLength").bail().custom((value, { req }) => {
            const session = req.session as any as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
            if (acspDetails) {
                const originalFirstName = normaliseName(acspDetails.soleTraderDetails?.forename);
                const originalMiddleName = normaliseName(acspDetails.soleTraderDetails?.otherForenames);
                const originalSurname = normaliseName(acspDetails.soleTraderDetails?.surname);

                if (originalFirstName === normaliseName(req.body["first-name"]) && originalMiddleName === normaliseName(req.body["middle-names"]) && originalSurname === normaliseName(value)) {
                    throw new Error("noChangeLastName");
                }
            }
            return true;
        })
];

const normaliseName = (name: string | undefined): string | undefined => {
    return name?.trim().toLowerCase().replace(spaceFormat, " ");
};
