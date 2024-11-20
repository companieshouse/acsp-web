import { body } from "express-validator";
import countryList from "../../lib/countryListWithUKCountries";
import { manualAddressValidator } from "./commonAddressManual";

const addressUKPostcodeFormat:RegExp = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
const addressPostcodevaild:RegExp = /^[A-Za-z0-9\s]*$/;

const manualCorrespondenceAddressValidator = [

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

// Creates a single validator that contains both the common manual address validator and the above validation
// This is done to reduce code duplication accross correspondence and business address validation
export const correspondenceAddressManualValidator = [
    ...manualAddressValidator,
    ...manualCorrespondenceAddressValidator
];
