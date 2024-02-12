import { body } from "express-validator";
import companyLookupErrorManifest from "../../lib/utils/error_manifests/companyLookup";
//import * as constants from "../../src/main/common/__utils/constants";

const characterPattern:RegExp = /^[a-zA-Z0-9]+$/;
export const companyNumberValidator = [

        body("company_number").trim().notEmpty().withMessage(companyLookupErrorManifest.validation.noData.summary).bail()
                .matches(characterPattern).withMessage(companyLookupErrorManifest.validation.companyNumber.summary).bail()
                .isLength({ min: 8, max: 8 }).withMessage(companyLookupErrorManifest.validation.characterLimit.summary)


];