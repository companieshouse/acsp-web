import { NameValidator } from "../../../../src/lib/validation/name";

describe("Validate name given is Valid", () => {
    const validator = new NameValidator();

    it("should return true if input is a valid name", () => {
        // Given
        const name = "Bob";
        // When
        const isName = validator.isValidName(name);
        // Then
        expect(isName).toBeTruthy();
    });
});

describe("Validate name given is invalid", () => {
    const validator = new NameValidator();

    it("should return false if input is not a valid name", () => {
        // Given
        const name = "B0b";
        // When
        const isName = validator.isValidName(name);
        // Then
        expect(isName).toBeFalsy();
    });
});
