import { body } from "express-validator";

const otherAddressDetailsFormat:RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressTownFormat:RegExp = /^[A-Za-z\-',\s!]*$/;
const addressCountyAndCountryFormat:RegExp = /^[A-Za-z\s]*$/;

export const manualAddressValidator = [

    body("addressPropertyDetails").trim().notEmpty().withMessage("noPropertyDetails").bail()
        .matches(otherAddressDetailsFormat).withMessage("invalidPropertyDetails").bail()
        .isLength({ max: 200 }).withMessage("invalidPropertyDetailsLength"),

    body("addressLine1").trim().notEmpty().withMessage("noAddressLine1").bail()
        .matches(otherAddressDetailsFormat).withMessage("invalidAddressLine1").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressLine1Length"),

    body("addressLine2").trim().matches(otherAddressDetailsFormat).withMessage("invalidAddressLine2").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressLine2Length"),

    body("addressTown").trim().notEmpty().withMessage("noCityOrTown").bail()
        .matches(addressTownFormat).withMessage("invalidAddressTown").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressTownLength"),

    body("addressCounty").trim().matches(addressCountyAndCountryFormat).withMessage("invalidAddressCounty").bail()
        .isLength({ max: 50 }).withMessage("invalidAddressCountyLength")
];
