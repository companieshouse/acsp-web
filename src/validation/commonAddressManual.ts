import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { body, ValidationChain } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { trimAndLowercaseString } from "../services/common";
import { Request } from "express-validator/src/base";
import { BUSINESS_ADDRESS_ALLOWED_CHARS } from "./regexParts";

const otherAddressDetailsFormat: RegExp = new RegExp(`^[${BUSINESS_ADDRESS_ALLOWED_CHARS}]*$`);
const addressTownFormat:RegExp = /^[A-Za-z\-',\s!]*$/;
const addressCountyAndCountryFormat:RegExp = /^[A-Za-z\-'\s]*$/;

export type ManualAddressValidationType = "serviceAddress" | "registeredOfficeAddress" | "registration";

export const manualAddressValidator = (type: ManualAddressValidationType): ValidationChain[] => [

    body("addressPropertyDetails").trim().notEmpty().withMessage("noPropertyDetails").bail()
        .matches(otherAddressDetailsFormat).withMessage("invalidPropertyDetails").bail()
        .isLength({ max: 200 }).withMessage("invalidPropertyDetailsLength").bail()
        .custom((value, { req }) => compareNewAndOldAddress(req, type)).withMessage("noUpdatePremises"),

    body("addressLine1").trim().notEmpty().withMessage("noAddressLine1").bail()
        .matches(otherAddressDetailsFormat).withMessage("invalidAddressLine1").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressLine1Length").bail()
        .custom((value, { req }) => compareNewAndOldAddress(req, type)).withMessage("noUpdateAddressLine1"),

    body("addressLine2").trim().matches(otherAddressDetailsFormat).withMessage("invalidAddressLine2").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressLine2Length").bail()
        .custom((value, { req }) => compareNewAndOldAddress(req, type)).withMessage("noUpdateAddressLine2"),

    body("addressTown").trim().notEmpty().withMessage("noCityOrTown").bail()
        .matches(addressTownFormat).withMessage("invalidAddressTown").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressTownLength").bail()
        .custom((value, { req }) => compareNewAndOldAddress(req, type)).withMessage("noUpdateAddressTown"),

    body("addressCounty").trim().matches(addressCountyAndCountryFormat).withMessage("invalidAddressCounty").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressCountyLength").bail()
        .custom((value, { req }) => compareNewAndOldAddress(req, type)).withMessage("noUpdateAddressCounty")
];

export const compareNewAndOldAddress = (req: Request, type: ManualAddressValidationType): boolean => {
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
            addressLine1: trimAndLowercaseString(originalAddress.addressLine1),
            addressLine2: trimAndLowercaseString(originalAddress.addressLine2),
            locality: trimAndLowercaseString(originalAddress.locality),
            region: trimAndLowercaseString(originalAddress.region),
            country: trimAndLowercaseString(originalAddress.country),
            postalCode: trimAndLowercaseString(originalAddress.postalCode)
        };

        const newAddress = {
            premises: trimAndLowercaseString(req.body.addressPropertyDetails),
            addressLine1: trimAndLowercaseString(req.body.addressLine1),
            addressLine2: trimAndLowercaseString(req.body.addressLine2),
            locality: trimAndLowercaseString(req.body.addressTown),
            region: trimAndLowercaseString(req.body.addressCounty),
            country: type === "serviceAddress" ? trimAndLowercaseString(req.body.countryInput) : trimAndLowercaseString(req.body.addressCountry),
            postalCode: trimAndLowercaseString(req.body.addressPostcode)
        };
        if (JSON.stringify(trimmedOriginalAddress) === JSON.stringify(newAddress)) {
            throw new Error();
        }
    }
    return true;
};
