import { body } from "express-validator";
import { manualAddressValidator } from "./commonAddressManual";

const addressUKPostcodeFormat:RegExp = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
const addressPostcodevaild:RegExp = /^[A-Za-z0-9\s]*$/;

const manualBusinessAddressValidator = [

    body("addressCountry", "countryIsMissing").notEmpty(),

    body("addressPostcode").trim().toUpperCase().notEmpty().withMessage("noPostCode").bail()
        .matches(addressPostcodevaild).withMessage("invalidPostcodeFormat").bail()
        .matches(addressUKPostcodeFormat).withMessage("invalidAddressPostcode").bail()
        .isLength({ min: 5, max: 50 }).withMessage("invalidAddressPostcode")
];

// Creates a single validator that contains both the common manual address validator and the above validation
// This is done to reduce code duplication accross correspondence and business address validation
export const businessAddressManualValidator = [
    ...manualAddressValidator,
    ...manualBusinessAddressValidator
];
