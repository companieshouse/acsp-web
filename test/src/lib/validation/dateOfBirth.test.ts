import dateOfBirthErrorManifest from "../../../../src/lib/utils/error_manifests/dateOfBirth";
import { dateDayChecker, dateMonthChecker, dateYearChecker, validDataChecker } from "../../../../src/lib/validation/dateOfBirth";

describe("Missing input validation tests", () => {
    test("Error if date field is completely empty", async () => {
        expect(() => dateDayChecker("", "", "")).toThrow(new Error(dateOfBirthErrorManifest.validation.noData.summary));
    });
    test("Error if day and month fields are empty", async () => {
        expect(() => dateDayChecker("", "", "1999")).toThrow(new Error(dateOfBirthErrorManifest.validation.noDayMonth.summary));
    });
    test("Error if day and year fields are empty", async () => {
        expect(() => dateDayChecker("", "02", "")).toThrow(new Error(dateOfBirthErrorManifest.validation.noDayYear.summary));
    });
    test("Error if month and year fields are empty", async () => {
        expect(() => dateMonthChecker("11", "", "")).toThrow(new Error(dateOfBirthErrorManifest.validation.noMonthYear.summary));
    });
    test("Error if day field is empty", async () => {
        expect(() => dateDayChecker("", "02", "1999")).toThrow(new Error(dateOfBirthErrorManifest.validation.noDay.summary));
    });
    test("Error if Month field is empty", async () => {
        expect(() => dateMonthChecker("11", "", "1999")).toThrow(new Error(dateOfBirthErrorManifest.validation.noMonth.summary));
    });
    test("Error if Year field is empty", async () => {
        expect(() => dateYearChecker("11", "02", "")).toThrow(new Error(dateOfBirthErrorManifest.validation.noYear.summary));
    });

    test("No error if all fields are input", async () => {
        expect(() => dateYearChecker("11", "02", "1999")).toBeTruthy();
    });
});

describe("Valid data input tests", () => {
    test("Error if month is greater than 12", async () => {
        expect(() => validDataChecker("11", "13", "1999")).toThrow(new Error(dateOfBirthErrorManifest.validation.invalid.summary));
    });
    test("Error if month is less than 1", async () => {
        expect(() => validDataChecker("11", "0", "1999")).toThrow(new Error(dateOfBirthErrorManifest.validation.invalid.summary));
    });
    test("Error if year is greater than 9999", async () => {
        expect(() => validDataChecker("11", "13", "99999")).toThrow(new Error(dateOfBirthErrorManifest.validation.invalid.summary));
    });
    test("Error if year is less than 1000", async () => {
        expect(() => validDataChecker("11", "13", "999")).toThrow(new Error(dateOfBirthErrorManifest.validation.invalid.summary));
    });
    test("Error if day is not valid", async () => {
        expect(() => validDataChecker("30", "02", "1999")).toThrow(new Error(dateOfBirthErrorManifest.validation.invalid.summary));
    });
    test("Error if date given is in the future", async () => {
        expect(() => validDataChecker("30", "11", "3490")).toThrow(new Error(dateOfBirthErrorManifest.validation.dateInFuture.summary));
    });
    test("Error if date given is more than 110 years ago", async () => {
        expect(() => validDataChecker("30", "11", "1490")).toThrow(new Error(dateOfBirthErrorManifest.validation.tooOld.summary));
    });
    test("Error if date given is less than 16 ago", async () => {
        expect(() => validDataChecker("29", "01", "2024")).toThrow(new Error(dateOfBirthErrorManifest.validation.tooYoung.summary));
    });
});
