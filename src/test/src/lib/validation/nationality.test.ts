import nationalityValidator from "../../../../../lib/utils/error_manifests/nationality";
import { validationResult } from "express-validator";
import { Request } from "express";

// Mock the express Request object for testing purposes
const mockRequest: Request = {} as Request;

describe("nationalityValidator", () => {
    it("should pass validation with valid input", () => {
    // Set valid input data
        const validInput = {
            nationality_input_0: "British",
            nationality_input_1: "French",
            nationality_input_2: "German"
        };

        // Validate the input
        const errors = validationResult({
            body: validInput
        });

        console.log(errors.array());
        expect(errors.isEmpty()).toBe(true);

    });

    it("should pass validation with valid input", () => {
        // Set valid input data
        const validInput = {
            nationality_input_0: "British",
            nationality_input_1: " ",
            nationality_input_2: " "
        };

        // Validate the input
        const errors = validationResult({
            body: validInput
        });

        console.log(errors.array());
        expect(errors.isEmpty()).toBe(true);

    });
});
