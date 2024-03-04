import { body } from "express-validator";
import { POSTCODE_ADDRESSES_LOOKUP_URL } from "../utils/properties";
import { getUKAddressesFromPostcode } from "../services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";

const addressDetailsFormat: RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressUKPostcodeFormat:RegExp = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
const addressPostcodevaild:RegExp = /^[A-Za-z0-9\s]*$/;

export const correspondenceAddressAutoLookupValidator = [

    body("postCode").trim().notEmpty().withMessage("correspondenceLookUpAddressNoPostCode").bail()
        .matches(addressPostcodevaild).withMessage("invalidPostcodeFormat").bail()
        .matches(addressUKPostcodeFormat).withMessage("invalidAddressPostcode").bail()
        .isLength({ min: 5, max: 50 }).withMessage("invalidAddressPostcode")

        .custom(async (postcode) => {
            postcode = postcode.replace(/\s/g, "");
            const ukAddresses: UKAddress[] = await getUKAddressesFromPostcode(POSTCODE_ADDRESSES_LOOKUP_URL, postcode);
            if (!ukAddresses.length) {
                throw new Error("invalidAddressPostcode");
            }
            return true;
        }),

    body("premise").trim().matches(addressDetailsFormat).withMessage("correspondenceLookUpAddressInvalidPropertyDetails").bail()

];
