import { body } from "express-validator";
import { POSTCODE_ADDRESSES_LOOKUP_URL } from "../utils/properties";
import { getUKAddressesFromPostcode } from "../services/postcode-lookup-service";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";

const addressDetailsFormat: RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressUKPostcodeFormat: RegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const correspondenceAddressAutoLookupValidator = [

    body("postCode").trim().notEmpty().withMessage("correspondenceLookUpAddressNoPostCode").bail()
        .matches(addressUKPostcodeFormat).withMessage("correspondenceLookUpAddressInvalidAddressPostcode").bail()
        .custom(async (postcode) => {
            postcode = postcode.replace(/\s/g, "");
            const ukAddresses: UKAddress[] = await getUKAddressesFromPostcode(POSTCODE_ADDRESSES_LOOKUP_URL, postcode);
            if (!ukAddresses.length) {
                throw new Error("correspondenceLookUpAddressInvalidAddressPostcode");
            }
            return true;
        }),

    body("premise").trim().matches(addressDetailsFormat).withMessage("correspondenceLookUpAddressInvalidPropertyDetails").bail()

];
