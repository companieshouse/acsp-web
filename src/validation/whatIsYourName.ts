import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { body } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { trimAndLowercaseString } from "../services/common";
import { ALLOWED_TEXT_CHARS } from "./regexParts";

const nameFormat: RegExp = new RegExp(`^[${ALLOWED_TEXT_CHARS}]*$`);

export const nameValidator = [
    body("first-name").trim().notEmpty().withMessage("enterFirstName").bail().matches(nameFormat).withMessage("invalidFirstNameFormat").bail().isLength({ max: 50 })
        .withMessage("invalidFirstNameLength").bail().custom((value, { req }) => {
            const session: Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
            if (acspDetails) {
                const originalFirstName = trimAndLowercaseString(acspDetails.soleTraderDetails!.forename);
                const originalMiddleName = trimAndLowercaseString(acspDetails.soleTraderDetails!.otherForenames);
                const originalSurname = trimAndLowercaseString(acspDetails.soleTraderDetails!.surname);

                if (originalFirstName === trimAndLowercaseString(value) && originalMiddleName === trimAndLowercaseString(req.body["middle-names"]) && originalSurname === trimAndLowercaseString(req.body["last-name"])) {
                    throw new Error("noChangeFirstname");
                }
            }
            return true;
        }),
    body("middle-names").trim().matches(nameFormat).withMessage("invalidMiddleNameFormat").bail().isLength({ max: 50 }).withMessage("invalidMiddleNameLength").bail()
        .custom((value, { req }) => {
            const session: Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
            if (acspDetails) {
                const originalFirstName = trimAndLowercaseString(acspDetails.soleTraderDetails!.forename);
                const originalMiddleName = trimAndLowercaseString(acspDetails.soleTraderDetails!.otherForenames);
                const originalSurname = trimAndLowercaseString(acspDetails.soleTraderDetails!.surname);

                if (originalFirstName === trimAndLowercaseString(req.body["first-name"]) && originalMiddleName === trimAndLowercaseString(value) && originalSurname === trimAndLowercaseString(req.body["last-name"])) {
                    throw new Error("noChangeMiddleNames");
                }
            }
            return true;
        }),
    body("last-name").trim().notEmpty().withMessage("enterLastName").bail().matches(nameFormat).withMessage("invalidLastNameFormat").bail().isLength({ max: 160 })
        .withMessage("invalidLastNameLength").bail().custom((value, { req }) => {
            const session: Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
            if (acspDetails) {
                const originalFirstName = trimAndLowercaseString(acspDetails.soleTraderDetails!.forename);
                const originalMiddleName = trimAndLowercaseString(acspDetails.soleTraderDetails!.otherForenames);
                const originalSurname = trimAndLowercaseString(acspDetails.soleTraderDetails!.surname);

                if (originalFirstName === trimAndLowercaseString(req.body["first-name"]) && originalMiddleName === trimAndLowercaseString(req.body["middle-names"]) && originalSurname === trimAndLowercaseString(value)) {
                    throw new Error("noChangeLastName");
                }
            }
            return true;
        })
];
