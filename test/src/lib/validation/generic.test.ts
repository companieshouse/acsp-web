import { GenericValidator } from "../../../../src/lib/validation/generic";

describe("Validate email address", () => {
    const validator = new GenericValidator();

    it("should return false if input is not a valid email address", () => {
        // Given
        const emailAddress = "test@test";
        // When
        const isEmailAddress = validator.isValidEmail(emailAddress);
        // Then
        expect(isEmailAddress).toBeFalsy();
    });
});
