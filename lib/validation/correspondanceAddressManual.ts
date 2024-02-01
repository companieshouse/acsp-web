import { body } from "express-validator";
import correspondanceAddressManualErrorManifest from "../utils/error_manifests/correspondanceAddressManual";

const otherAddressDetailsFormat:RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressTownFormat:RegExp = /^[A-Za-z0-9\-',\s!]*$/;
const addressCountyAndCountryFormat:RegExp = /^[A-Za-z\s]*$/;
const addressUKPostcodeFormat:RegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const correspondanceAddressManualValidator = [
    body("addressPropertyDetails").trim().notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noPropertyDetails.summary).bail()
        .matches(otherAddressDetailsFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidPropertyDetails.summary).bail()
        .isLength({ max: 200 }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidPropertyDetailsLength.summary),

    body("addressLine1").trim().notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noAddressLine1.summary).bail()
        .matches(otherAddressDetailsFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine1.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine1Length.summary),

    body("addressLine2").trim().matches(otherAddressDetailsFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine2.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine2Length.summary),

    body("addressTown").trim().notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noCityOrTown.summary).bail()
        .matches(addressTownFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressTown.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressTownLength.summary),

    body("addressCounty").custom((value, { req }) => addressCountyAndCountryChecker(req.body.addressCounty, correspondanceAddressManualErrorManifest.validation.invalidAddressCounty.summary, correspondanceAddressManualErrorManifest.validation.invalidAddressCountyLength.summary)),
    body("addressCountry").custom((value, { req }) => addressCountyAndCountryChecker(req.body.addressCountry, correspondanceAddressManualErrorManifest.validation.invalidAddressCountry.summary, correspondanceAddressManualErrorManifest.validation.invalidAddressCountryLength.summary)),

    body("addressPostcode").trim().notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noPostCode.summary).bail()
        .matches(addressUKPostcodeFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressPostcode.summary).bail()
        .isLength({ min: 6, max: 50 }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressPostcode.summary)
];

export const addressCountyAndCountryChecker = (addressDetail: string, addressFormatError: string, addressLengthError: string) => {
    addressDetail = addressDetail.trim();
    if (addressDetail !== "") {
        if (!addressDetail.match(addressCountyAndCountryFormat)) {
            throw new Error(addressFormatError);
        } else if (addressDetail.length < 5 || addressDetail.length > 50) {
            throw new Error(addressLengthError);
        }
    }
    return true;
};
