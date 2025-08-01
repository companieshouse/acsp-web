import { body, ValidationChain } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { Request } from "express-validator/src/base";
import { isLimitedBusinessType, trimAndLowercaseString } from "../services/common";
import { BUSINESS_ADDRESS_ALLOWED_CHARS } from "./regexParts";

const addressDetailsFormat: RegExp = new RegExp(`^[${BUSINESS_ADDRESS_ALLOWED_CHARS}]*$`);

const addressUKPostcodeFormat:RegExp = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
const addressPostcodevaild:RegExp = /^[A-Za-z0-9\s]*$/;

type AddressLookupValidationType = "serviceAddress" | "registeredOfficeAddress" | "registration";

export const correspondenceAddressAutoLookupValidator = (type: AddressLookupValidationType): ValidationChain[] => [

    body("postCode").trim().notEmpty().withMessage((value, { req }) => getAddressMessage(type, req)).toUpperCase().bail()
        .matches(addressPostcodevaild).withMessage("invalidPostcodeFormat").bail()
        .matches(addressUKPostcodeFormat).withMessage("invalidAddressPostcode").bail()
        .isLength({ min: 5, max: 50 }).withMessage("invalidAddressPostcode").bail()
        .custom((value, { req }) => compareNewAndOldAddressForLookup(req, type)).withMessage((value, { req }) => getAddressMessage(type, req)),

    body("premise").trim().matches(addressDetailsFormat).withMessage("invalidPropertyDetails").bail()
        .custom((value, { req }) => compareNewAndOldAddressForLookup(req, type)).withMessage("noUpdatePremises")
];

const compareNewAndOldAddressForLookup = (req: Request, type: AddressLookupValidationType): boolean => {
    const session: Session = req.session as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
    if (acspDetails) {

        let originalAddress;
        if (type === "registeredOfficeAddress" || (type === "serviceAddress" && acspDetails.type === "sole-trader")) {
            originalAddress = acspDetails.registeredOfficeAddress;
        } else {
            originalAddress = acspDetails.serviceAddress!;
        }
        const trimmedOriginalAddress = {
            premises: trimAndLowercaseString(originalAddress.premises),
            postalCode: trimAndLowercaseString(originalAddress.postalCode)
        };

        const newAddress = {
            premises: trimAndLowercaseString(req.body.premise),
            postalCode: trimAndLowercaseString(req.body.postCode)
        };
        if (JSON.stringify(trimmedOriginalAddress) === JSON.stringify(newAddress)) {
            throw new Error();
        }
    }
    return true;
};

const getAddressMessage = (type: AddressLookupValidationType, req: Request) => {
    if (type === "registration") {
        return "noPostCode";
    } else if (type === "serviceAddress") {
        return "correspondenceLookUpAddressNoPostCodeUpdate";
    }
    const session: Session = req.session as Session;
    const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS);
    if (acspDetails) {
        if (isLimitedBusinessType(acspDetails.type)) {
            return "registeredOfficeLookUpAddressNoPostCodeUpdate";
        }
        return "businessLookUpAddressNoPostCodeUpdate";
    }
};
