import { body } from "express-validator";
import nationalityList from "../../../lib/nationalityList";
import nationalityErrorManifest from "../../../lib/utils/error_manifests/nationality";

export const nationalityValidator = [
    // Validation for 'nationality_input_0'
    body("nationality_input_0", nationalityErrorManifest.validation.noNationality.summary).trim().notEmpty().bail().isIn(nationalityList.split(";")),

    // Validation for 'nationality_input_1'
    body("nationality_input_1")
        .custom((value, { req }) => {
            if (!nationalityList.includes(value.trim()) && value.trim() !== "") { // Checks the nationality is in the list of nationalities
                throw new Error(nationalityErrorManifest.validation.invalid.summary);
            } else if (value.trim() === req.body.nationality_input_0.trim() && value.trim() !== "") { // Check if it's the same as 'nationality_input_0'
                throw new Error(nationalityErrorManifest.validation.doubleSecondNationality.summary);
            } else if (req.body.nationality_input_0 !== "" && value.trim() === "" && req.body.nationality_input_2 !== "") { // Check if 'nationality_input_0' is filled, 'nationality_input_1' is empty, and 'nationality_input_2' is filled
                throw new Error(nationalityErrorManifest.validation.invalid.summary);
            }
            return true;
        }),

    // Validation for 'nationality_input_2'
    body("nationality_input_2")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList.split(";")).withMessage(nationalityErrorManifest.validation.invalid.summary).bail()
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInputSecond' or 'nationalityInput'
            if ((value === req.body.nationality_input_1 || value === req.body.nationality_input_0) && value !== " ") {
                throw new Error(nationalityErrorManifest.validation.doubleThirdNationality.summary);
            }
            return true;
        })
        .isString().withMessage(nationalityErrorManifest.validation.invalid.summary)
];
