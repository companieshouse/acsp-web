import { ValidationError } from "express-validator";
import { resolveErrorMessage, formatValidationError } from "../../../main/validation/validation";
import { getLocalesService } from "../../../main/utils/localise";

describe("resolveErrorMessage", () => {
    it("should return the original error message if it cannot be resolved", () => {
        const errorMessage = "some_error_message";
        const lang = "en";

        // Mock the getLocalesService function
        const mockResolveSingleKey = jest.fn(() => "error-" + errorMessage);
        jest.spyOn(getLocalesService().i18nCh, "resolveSingleKey").mockImplementation(mockResolveSingleKey);

        const resolvedErrorMessage = resolveErrorMessage(errorMessage, lang);
        expect(resolvedErrorMessage).toEqual(errorMessage);
        expect(mockResolveSingleKey).toHaveBeenCalledWith("error-" + errorMessage, lang);
    });

    it("should return the original error message if lang is undefined", () => {
        const errorMessage = "some_error_message";
        const resolvedErrorMessage = resolveErrorMessage(errorMessage);
        expect(resolvedErrorMessage).toEqual(errorMessage);
    });

});
