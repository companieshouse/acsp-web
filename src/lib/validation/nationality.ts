import { body, ValidationChain } from "express-validator";
import nationalityList from "../../lib/nationalityList";
import nationalityErrorManifest from "../utils/error_manifests/nationality";

export const nationalityValidator: ValidationChain[] = [
    // Validation for 'nationalityInput'
    body("nationalityInput")
        .notEmpty().withMessage(nationalityErrorManifest.validation.noNationality.summary)
        .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
        .trim()
        .isLength({ max: 50 }).withMessage(nationalityErrorManifest.validation.charLimit1stNationality.summary),

    // Validation for 'nationalityInputSecond'
    body("nationalityInputSecond")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInput'
            if (value === req.body.nationalityInput && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleSecondNationality.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
        .trim()
        .isLength({ max: 49 }).withMessage(nationalityErrorManifest.validation.charLimit2ndNationality.summary),

    // Validation for 'nationalityInputThird'
    body("nationalityInputThird")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInputSecond' or 'nationalityInput'
            if ((value === req.body.nationalityInputSecond || value === req.body.nationalityInput) && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleThirdNationality.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
        .trim()
        .isLength({ max: 48 }).withMessage(nationalityErrorManifest.validation.charLimit3rdNationality.summary)
];
