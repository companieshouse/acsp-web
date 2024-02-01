import { body } from "express-validator";
import correspondanceAddressManualErrorManifest from "../utils/error_manifests/correspondanceAddressManual";

const otherAddressDetailsFormat:RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressTownFormat:RegExp = /^[A-Za-z0-9\-',\s!]*$/;
const addressCountyFormat:RegExp = /^[A-Za-z\s]*$/;
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

    body("addressCounty").custom((value, { req }) => addressCountyChecker(req.body.addressCounty)),
    body("addressCountry").custom((value, { req }) => addressCountryChecker(req.body.addressCountry)),

    body("addressPostcode").trim().notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noPostCode.summary).bail()
        .matches(addressUKPostcodeFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressPostcode.summary).bail()
        .isLength({ min: 6, max: 50 }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressPostcode.summary)
];

export const addressCountyChecker = (addressCounty: string) => {
    addressCounty = addressCounty.trim();
    if (addressCounty !== "") {
        if (!addressCounty.match(addressCountyFormat)) {
            throw new Error(correspondanceAddressManualErrorManifest.validation.invalidAddressCounty.summary);
        } else if (addressCounty.length < 5 || addressCounty.length > 50) {
            throw new Error(correspondanceAddressManualErrorManifest.validation.invalidAddressCountyLength.summary);
        }
    }
    return true;
};

export const addressCountryChecker = (addressCountry: string) => {
    addressCountry = addressCountry.trim();
    if (addressCountry !== "") {
        if (!addressCountry.match(addressCountyFormat)) {
            throw new Error(correspondanceAddressManualErrorManifest.validation.invalidAddressCountry.summary);
        } else if (addressCountry.length < 5 || addressCountry.length > 50) {
            throw new Error(correspondanceAddressManualErrorManifest.validation.invalidAddressCountryLength.summary);
        }
    }
    return true;
};
