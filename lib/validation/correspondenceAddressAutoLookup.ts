import {body} from "express-validator";
import correspondenceAddressAutoLookUpErrorManifest from "../utils/error_manifests/correspondenceAddressAutoLookUp";

const addressDetailsFormat: RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressUKPostcodeFormat: RegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const correspondenceAddressAutoLookupValidator = [
    body("postCode").trim().notEmpty().withMessage(correspondenceAddressAutoLookUpErrorManifest.validation.noPostCode.summary).bail()
        .matches(addressUKPostcodeFormat).withMessage(correspondenceAddressAutoLookUpErrorManifest.validation.invalidAddressPostcode.summary).bail(),

    body("premise").trim().matches(addressDetailsFormat).withMessage(correspondenceAddressAutoLookUpErrorManifest.validation.invalidPropertyDetails.summary).bail(),

];
