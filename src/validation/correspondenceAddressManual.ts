import { body } from "express-validator";
import countryList from "../../lib/countryListWithUKCountries";

const otherAddressDetailsFormat:RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressTownFormat:RegExp = /^[A-Za-z\-',\s!]*$/;
const addressCountyAndCountryFormat:RegExp = /^[A-Za-z\s]*$/;
const addressUKPostcodeFormat:RegExp = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
const addressPostcodevaild:RegExp = /^[A-Za-z0-9\s]*$/;

export const manualCorrespondenceAddressValidator = [

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
        .isLength({ max: 50 }).withMessage("invalidAddressCountyLength"),

    body("countryInput", "countryIsMissing").notEmpty().bail().isIn(countryList.split(";")),

    body("addressPostcode").trim().toUpperCase().notEmpty().withMessage("noPostCode").bail()
        .custom((value: string, { req }) => {
            if (req.body.countryInput === "England" || req.body.countryInput === "Wales" ||
                req.body.countryInput === "Scotland" || req.body.countryInput === "Northern Ireland" ||
                req.body.countryInput === "United Kingdom") {
                if (!addressPostcodevaild.test(value)) {
                    throw new Error("invalidPostcodeFormat");
                }
                if (!addressUKPostcodeFormat.test(value)) {
                    throw new Error("invalidAddressPostcode");
                }
            } else {
                if (value.length > 15) {
                    throw new Error("invalidPostcodeLength");
                }
                if (!addressPostcodevaild.test(value)) {
                    throw new Error("invalidPostcodeFormat");
                }
            }
            return true;
        })
];
