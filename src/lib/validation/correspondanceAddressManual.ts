import { body } from "express-validator";
import correspondanceAddressManualErrorManifest from "../utils/error_manifests/correspondanceAddressManual";

const otherAddressDetailsFormat:RegExp = /^[A-Za-z0-9\-',\s]*$/;
const addressTownFormat:RegExp = /^[A-Za-z0-9\-',\s!]*$/;
const addressCountyFormat:RegExp = /^[A-Za-z]*$/;
const addressUKPostcodeFormat:RegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

const addressPropertyDetailsLength = 200;
const otherAddressDetailsLength = 50;

export const correspondanceAddressManualValidator = [
    body("addressPropertyDetails").notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noPropertyDetails.summary).bail()
        .matches(otherAddressDetailsFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidPropertyDetails.summary).bail()
        .isLength({ min: 1, max: addressPropertyDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidPropertyDetailsLength.summary),

    body("addressLine1").notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noAddressLine1.summary).bail()
        .matches(otherAddressDetailsFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine1.summary).bail()
        .isLength({ min: 1, max: otherAddressDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine1Length.summary),

    body("addressLine2").matches(otherAddressDetailsFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine2.summary).bail()
        .isLength({ max: otherAddressDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressLine2Length.summary),

    body("addressTown").notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noCityOrTown.summary).bail()
        .matches(addressTownFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressTown.summary).bail()
        .isLength({ min: 1, max: otherAddressDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressTownLength.summary),

    body("addressCounty").matches(addressCountyFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressCounty.summary).bail()
        .isLength({ max: otherAddressDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressCountyLength.summary),

    body("addressCountry").matches(addressCountyFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressCountry.summary).bail()
        .isLength({ max: otherAddressDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressCountryLength.summary),

    body("addressPostcode").notEmpty().withMessage(correspondanceAddressManualErrorManifest.validation.noPostCode.summary).bail()
        .matches(addressUKPostcodeFormat).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressPostcode.summary).bail()
        .isLength({ min: 1, max: otherAddressDetailsLength }).withMessage(correspondanceAddressManualErrorManifest.validation.invalidAddressPostcode.summary)
];
