import { CorrespondanceAddressManualValidator } from "../../../../src/lib/validation/correspondanceAddressManual";

// Given a correct addressPropertyDetails should return true.
describe("Validate addressPropertyDetails given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressPropertyDetails", () => {
        var format = /^[A-Za-z0-9\-',\s]*$/;
        // Given
        const addressPropertyDetails = "abc";
        // When
        const isValidDetails = validator.isValidFormat(addressPropertyDetails, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressPropertyDetails should return false.
describe("Validate addressPropertyDetails given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressPropertyDetails", () => {
        var format = /^[A-Za-z0-9\-',\s]*$/;
        // Given
        const addressPropertyDetails = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressPropertyDetails, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given an incorrect addressPropertyDetails length should return false.
describe("Validate addressPropertyDetails length given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressPropertyDetails length", () => {
        var length = 200;
        // Given
        const addressPropertyDetails = "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx5Abcdefghijklmnopqrstuvwx6Abcdefghijklmnopqrstuvwx7Abcdefghijklmnopqrstuvwx8abc";
        // When
        const isValidDetails = validator.isValidLength(addressPropertyDetails, length);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given a correct addressLine1 should return true.
describe("Validate addressLine1 given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressLine1", () => {
        var format = /^[A-Za-z0-9\-',\s]*$/;
        // Given
        const addressLine1 = "abc";
        // When
        const isValidDetails = validator.isValidFormat(addressLine1, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressLine1 should return false.
describe("Validate addressLine1 given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressLine1", () => {
        var format = /^[A-Za-z0-9\-',\s]*$/;
        // Given
        const addressLine1 = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressLine1, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given an incorrect addressLine1 length should return false.
describe("Validate addressLine1 length given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressLine1 length", () => {
        var length = 50;
        // Given
        const addressLine1 = "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx5Abcdefghijklmnopqrstuvwx6Abcdefghijklmnopqrstuvwx7Abcdefghijklmnopqrstuvwx8abc";
        // When
        const isValidDetails = validator.isValidLength(addressLine1, length);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given a correct addressLine2 should return true.
describe("Validate addressLine2 given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressLine2", () => {
        var format = /^[A-Za-z0-9\-',\s]*$/;
        // Given
        const addressLine2 = "abc";
        // When
        const isValidDetails = validator.isValidFormat(addressLine2, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressLine2 should return false.
describe("Validate addressLine2 given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressLine2", () => {
        var format = /^[A-Za-z0-9\-',\s]*$/;
        // Given
        const addressLine2 = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressLine2, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given an incorrect addressLine2 length should return false.
describe("Validate addressLine2 length given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressLine2 length", () => {
        var length = 50;
        // Given
        const addressLine2 = "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx5Abcdefghijklmnopqrstuvwx6Abcdefghijklmnopqrstuvwx7Abcdefghijklmnopqrstuvwx8abc";
        // When
        const isValidDetails = validator.isValidLength(addressLine2, length);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given a correct addressTown should return true.
describe("Validate addressTown given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressTown", () => {
        var format = /^[A-Za-z0-9\-',\s!]*$/;
        // Given
        const addressTown = "abc!";
        // When
        const isValidDetails = validator.isValidFormat(addressTown, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressTown should return false.
describe("Validate addressTown given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressTown", () => {
        var format = /^[A-Za-z0-9\-',\s!]*$/;
        // Given
        const addressTown = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressTown, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given an incorrect addressTown length should return false.
describe("Validate addressTown length given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressTown length", () => {
        var length = 50;
        // Given
        const addressTown = "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx5Abcdefghijklmnopqrstuvwx6Abcdefghijklmnopqrstuvwx7Abcdefghijklmnopqrstuvwx8abc";
        // When
        const isValidDetails = validator.isValidLength(addressTown, length);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given a correct addressCounty should return true.
describe("Validate addressCounty given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressCounty", () => {
        var format = /^[A-Za-z]*$/;
        // Given
        const addressCounty = "abc!";
        // When
        const isValidDetails = validator.isValidFormat(addressCounty, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressCounty should return false.
describe("Validate addressCounty given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressTown", () => {
        var format = /^[A-Za-z]*$/;
        // Given
        const addressCounty = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressCounty, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given an incorrect addressCounty length should return false.
describe("Validate addressCounty length given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressCounty length", () => {
        var length = 50;
        // Given
        const addressCounty = "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx5Abcdefghijklmnopqrstuvwx6Abcdefghijklmnopqrstuvwx7Abcdefghijklmnopqrstuvwx8abc";
        // When
        const isValidDetails = validator.isValidLength(addressCounty, length);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given a correct addressCountry should return true.
describe("Validate addressCountry given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressCountry", () => {
        var format = /^[A-Za-z]*$/;
        // Given
        const addressCountry = "abc!";
        // When
        const isValidDetails = validator.isValidFormat(addressCountry, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressCountry should return false.
describe("Validate addressCountry given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressCountry", () => {
        var format = /^[A-Za-z]*$/;
        // Given
        const addressCountry = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressCountry, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given an incorrect addressCountry length should return false.
describe("Validate addressCountry length given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressCountry length", () => {
        var length = 50;
        // Given
        const addressCountry = "Abcdefghijklmnopqrstuvwx1Abcdefghijklmnopqrstuvwx2Abcdefghijklmnopqrstuvwx3Abcdefghijklmnopqrstuvwx4Abcdefghijklmnopqrstuvwx5Abcdefghijklmnopqrstuvwx6Abcdefghijklmnopqrstuvwx7Abcdefghijklmnopqrstuvwx8abc";
        // When
        const isValidDetails = validator.isValidLength(addressCountry, length);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});

// Given a correct addressPostcode should return true.
describe("Validate addressPostcode given is valid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return true if input is a valid addressPostcode", () => {
        var format = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;
        // Given
        const addressPostcode = "MK9 3GB";
        // When
        const isValidDetails = validator.isValidFormat(addressPostcode, format);
        // Then
        expect(isValidDetails).toBeTruthy;
    });
});

// Given an incorrect addressPostcode should return false.
describe("Validate addressPostcode given is invalid", () => {
    const validator = new CorrespondanceAddressManualValidator();

    it("Should return false if input is a invalid addressPostcode", () => {
        var format = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;
        // Given
        const addressPostcode = "abc@";
        // When
        const isValidDetails = validator.isValidFormat(addressPostcode, format);
        // Then
        expect(isValidDetails).toBeFalsy;
    });
});
