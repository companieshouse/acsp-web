import nationalityValidator from "../../../../src/lib/utils/error_manifests/nationality";
import { validationResult } from "express-validator";
import { Request } from "express";

// Mock the express Request object for testing purposes
const mockRequest: Request = {} as Request;

describe("nationalityValidator", () => {
    it("should pass validation with valid input", () => {
    // Set valid input data
        const validInput = {
            nationalityInput: "British",
            nationalityInputSecond: "French",
            nationalityInputThird: "German"
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
            nationalityInput: "British",
            nationalityInputSecond: " ",
            nationalityInputThird: " "
        };

        // Validate the input
        const errors = validationResult({
            body: validInput
        });

        console.log(errors.array());
        expect(errors.isEmpty()).toBe(true);

    });
});
