import { body } from "express-validator";

const addressDetailsFormat: RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressUKPostcodeFormat: RegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const correspondenceAddressAutoLookupValidator = [

    body("postCode").trim().notEmpty().withMessage("correspondenceLookUpAddressNoPostCode").bail()
        .matches(addressUKPostcodeFormat).withMessage("correspondenceLookUpAddressInvalidAddressPostcode").bail(),

    body("premise").trim().matches(addressDetailsFormat).withMessage("correspondenceLookUpAddressInvalidPropertyDetails").bail()

];
