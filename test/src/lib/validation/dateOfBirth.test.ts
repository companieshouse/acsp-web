import { DateOfBirthValidator } from "../../../../src/lib/validation/dateOfBirth";

// Given a correct month test should return true.
describe("Validate month given is valid", () => {
    const validator = new DateOfBirthValidator();

    it("Should return true if input is a valid month", () => {
        // Given
        const month = 12;
        // When
        const isValidMonth = validator.isValidMonth(month);
        // Then
        expect(isValidMonth).toBeTruthy;
    });
});

// Given an incorrect month test should return false.
describe("Validate month given is invalid", () => {
    const validator = new DateOfBirthValidator();

    it("Should return false if input is an invalid month", () => {
        // Given
        const month = 13;
        // When
        const isValidMonth = validator.isValidMonth(month);
        // Then
        expect(isValidMonth).toBeFalsy;
    });
});

// Given a correct year test should return true.
describe("Validate year given is valid", () => {
    const validator = new DateOfBirthValidator();

    it("Should return true if input is a valid year", () => {
        // Given
        const year = 1999;
        // When
        const isValidYear = validator.isValidYear(year);
        // Then
        expect(isValidYear).toBeTruthy;
    });
});

// Given an incorrect year test should return false.
describe("Validate year given is invalid", () => {
    const validator = new DateOfBirthValidator();

    it("Should return false if input is an invalid year", () => {
        // Given
        const year = 999;
        // When
        const isValidYear = validator.isValidYear(year);
        // Then
        expect(isValidYear).toBeFalsy;
    });
});

// Given a correct day test should return true.
describe("Validate day given is valid", () => {
    const validator = new DateOfBirthValidator();

    it("Should return true if input is a valid day", () => {
        // Given
        const day = 2;
        const month = 11;
        const year = 1994;
        // When
        const isValidDay = validator.isValidDay(day, month, year);
        // Then
        expect(isValidDay).toBeTruthy;
    });
});

// Given a incorrect day test should return false.
describe("Validate day given is invalid", () => {
    const validator = new DateOfBirthValidator();

    it("Should return false if input is an invalid day", () => {
        // Given
        const day = 32;
        const month = 11;
        const year = 1994;
        // When
        const isValidDay = validator.isValidDay(day, month, year);
        // Then
        expect(isValidDay).toBeFalsy;
    });
});

// Given a day, month and year in the past, test should return true.
describe("Validate day, month and year given are in the past", () => {
    const validator = new DateOfBirthValidator();

    it("Should return true if input is in the past", () => {
        // Given
        const day = 2;
        const month = 11;
        const year = 1994;
        // When
        const isNotInFuture = validator.isNotInFuture(day, month, year);
        // Then
        expect(isNotInFuture).toBeTruthy;
    });
});

// Given a day, month and year in the future test should return false.
describe("Validate day, month and year given are not in the past", () => {
    const validator = new DateOfBirthValidator();

    it("Should return false if input is in the future", () => {
        // Given
        var date = new Date();
        date.setDate(date.getDate() + 14); // creates a new date 14 days in the future
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        // When
        const isNotInFuture = validator.isNotInFuture(day, month, year);
        // Then
        expect(isNotInFuture).toBeFalsy;
    });
});

// Given a day, month and year in the past, test should return true if the date is 16 or more years ago.
describe("Validate day, month and year given are 16 or more years ago", () => {
    const validator = new DateOfBirthValidator();

    it("Should return true if input is 16 or more years ago", () => {
        // Given
        var date = new Date();
        date.setFullYear(date.getFullYear() - 16); // creates a new date 16 years in the past
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        // When
        const isNotTooYoung = validator.isNotTooYoung(day, month, year);
        // Then
        expect(isNotTooYoung).toBeTruthy;
    });
});

// Given a day, month and year in the past test should return false if the date is less than 16 years ago.
describe("Validate day, month and year given are less than 16 years ago", () => {
    const validator = new DateOfBirthValidator();

    it("Should return false if input is less than 16 years ago", () => {
        // Given
        var date = new Date();
        date.setDate(date.getDate() + 1);
        date.setFullYear(date.getFullYear() - 16); // creates a new date 16 years - 1 day in the past
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        // When
        const isNotTooYoung = validator.isNotTooYoung(day, month, year);
        // Then
        expect(isNotTooYoung).toBeFalsy;
    });
});

// Given a day, month and year in the past, test should return true if the date is less than or equal to 110 years ago.
describe("Validate day, month and year given are 110 years or less ago", () => {
    const validator = new DateOfBirthValidator();

    it("Should return true if input is less than 110 years ago", () => {
        // Given
        var date = new Date();
        date.setFullYear(date.getFullYear() - 110); // creates a new date 110 years day in the past
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        // When
        const isNotTooOld = validator.isNotTooOld(day, month, year);
        // Then
        expect(isNotTooOld).toBeTruthy;
    });
});

// Given a day, month and year in the past, test should return false if the date is more than 110 years ago.
describe("Validate day, month and year given are more than 110 years ago", () => {
    const validator = new DateOfBirthValidator();

    it("Should return false if input is more than 110 years ago", () => {
        // Given
        var date = new Date();
        date.setDate(date.getDate() - 1);
        date.setFullYear(date.getFullYear() - 110); // creates a new date 110 years + 1 day in the past
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        // When
        const isNotTooOld = validator.isNotTooOld(day, month, year);
        // Then
        expect(isNotTooOld).toBeFalsy;
    });
});
