import { body } from "express-validator";
import correspondenceAddressManualErrorManifest from "../utils/error_manifests/correspondenceAddressManual";

const otherAddressDetailsFormat:RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressTownFormat:RegExp = /^[A-Za-z0-9\-',\s!]*$/;
const addressCountyAndCountryFormat:RegExp = /^[A-Za-z\s]*$/;
const addressUKPostcodeFormat:RegExp = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;

export const correspondenceAddressManualValidator = [
    body("addressPropertyDetails").trim().notEmpty().withMessage(correspondenceAddressManualErrorManifest.validation.noPropertyDetails.summary).bail()
        .matches(otherAddressDetailsFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidPropertyDetails.summary).bail()
        .isLength({ max: 200 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidPropertyDetailsLength.summary),

    body("addressLine1").trim().notEmpty().withMessage(correspondenceAddressManualErrorManifest.validation.noAddressLine1.summary).bail()
        .matches(otherAddressDetailsFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressLine1.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressLine1Length.summary),

    body("addressLine2").trim().matches(otherAddressDetailsFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressLine2.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressLine2Length.summary),

    body("addressTown").trim().notEmpty().withMessage(correspondenceAddressManualErrorManifest.validation.noCityOrTown.summary).bail()
        .matches(addressTownFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressTown.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressTownLength.summary),

    body("addressCounty").trim().matches(otherAddressDetailsFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressCounty.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressCountyLength.summary),

    body("addressCountry").trim().matches(otherAddressDetailsFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressCountry.summary).bail()
        .isLength({ max: 50 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressCountryLength.summary),

    body("addressPostcode").trim().toUpperCase().notEmpty().withMessage(correspondenceAddressManualErrorManifest.validation.noPostCode.summary).bail()
        .matches(addressUKPostcodeFormat).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressPostcode.summary).bail()
        .isLength({ min: 5, max: 50 }).withMessage(correspondenceAddressManualErrorManifest.validation.invalidAddressPostcode.summary)
];
