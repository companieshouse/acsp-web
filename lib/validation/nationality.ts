import { body } from "express-validator";
import nationalityList from "../nationalityList";
import nationalityErrorManifest from "../utils/error_manifests/nationality";


export const nationalityValidator = [
    // Validation for 'nationality_input_0'
    body("nationality_input_0", nationalityErrorManifest.validation.noNationality.summary).trim().notEmpty().bail().isIn(nationalityList.split(";")),


    // Validation for 'nationality_input_1'
    body("nationality_input_1")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList.split(";")).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInput'
            if (value === req.body.nationality_input_0 && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleSecondNationality.summary);
            }
            return true;
        })

        .custom((value, { req }) => {
            // Check if 'nationality_input_0' is filled, 'nationality_input_1' is empty, and 'nationality_input_2' is filled
            if (req.body.nationality_input_0 && !value && req.body.nationality_input_2 && value === " ") {
                throw new Error(nationalityErrorManifest.validation.invalid.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary),



    // Validation for 'nationality_input_2'
    body("nationality_input_2")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList.split(";")).withMessage(nationalityErrorManifest.validation.invalid.summary)
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInputSecond' or 'nationalityInput'
            if ((value === req.body.nationality_input_1 || value === req.body.nationality_input_0) && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleThirdNationality.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
];



