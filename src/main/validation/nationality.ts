import { body } from "express-validator";
import nationalityList from "../../../lib/nationalityList";

export const nationalityValidator = [
    // Validation for 'nationality_input_0'
    body("nationality_input_0", "invalidNationalityNoData").trim().notEmpty().bail().isIn(nationalityList.split(";")),

    // Validation for 'nationality_input_1'
    body("nationality_input_1")
        .custom((value, { req }) => {
            if (!nationalityList.split(";").includes(value.trim()) && value.trim() !== "") { // Checks the nationality is in the list of nationalities
                throw new Error("invalidNationalityNoNationality");
            } else if (value.trim() === req.body.nationality_input_0.trim() && value.trim() !== "") { // Check if it's the same as 'nationality_input_0'
                throw new Error("invalidNationalityDoubleSecondNationality");
            } else if (req.body.nationality_input_0 !== "" && value.trim() === "" && req.body.nationality_input_2 !== "") { // Check if 'nationality_input_0' is filled, 'nationality_input_1' is empty, and 'nationality_input_2' is filled
                throw new Error("invalidNationalityNoNationality");
            }
            return true;
        }),

    // Validation for 'nationality_input_2'
    body("nationality_input_2")
        .optional({ nullable: true, checkFalsy: true })
        .isIn(nationalityList.split(";")).withMessage("invalidNationalityNoNationality").bail()
        .custom((value, { req }) => {
            // Check if it's the same as 'nationalityInputSecond' or 'nationalityInput'
            if ((value === req.body.nationality_input_1 || value === req.body.nationality_input_0) && value !== " ") {
                throw new Error("invalidNationalityDoubleThirdNationality");
            }
            return true;
        })
        .isString().withMessage("invalidNationalityNoNationality")
];
