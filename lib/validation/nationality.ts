import { body, ValidationChain } from "express-validator";
import nationalityList from "../nationalityList";
import nationalityErrorManifest from "../utils/error_manifests/nationality";



export const nationalityValidator = [
    // Validation for 'nationalityInput'
    body("nationality_input_0")
        .notEmpty().withMessage(nationalityErrorManifest.validation.noNationality.summary)
        .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
        .isLength({ max: 50 }).withMessage(nationalityErrorManifest.validation.charLimit1stNationality.summary),


    // Validation for 'nationalityInputSecond'
    body("nationality_input_1")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInput'
            if (value === req.body.nationality_input_0 && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleSecondNationality.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
        .isLength({ max: 49 }).withMessage(nationalityErrorManifest.validation.charLimit2ndNationality.summary),

    // Validation for 'nationalityInputThird'
    body("nationality_input_2")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInputSecond' or 'nationalityInput'
            if ((value === req.body.nationality_input_1 || value === req.body.nationality_input_0) && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleThirdNationality.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
        .isLength({ max: 48 }).withMessage(nationalityErrorManifest.validation.charLimit3rdNationality.summary)
];
