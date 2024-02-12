import { body } from "express-validator";
import companyLookupErrorManifest from "../../lib/utils/error_manifests/companyLookup";
//import * as constants from "../../src/main/common/__utils/constants";

export const companyNumberValidator = [
    body("company_number")
        .notEmpty().withMessage(companyLookupErrorManifest.validation.noData.summary)
        .isLength({ min: 8, max: 8 }).withMessage(companyLookupErrorManifest.validation.characterLimit.summary)
        .isAlphanumeric().withMessage(companyLookupErrorManifest.validation.companyNumber.summary)
];