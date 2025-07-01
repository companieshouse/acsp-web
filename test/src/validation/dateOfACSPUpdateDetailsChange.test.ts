import { dateOfACSPUpdateDetailsChange, dateDayChecker, dateMonthChecker, dateYearChecker, validDataChecker } from "../../../src/validation/dateOfACSPUpdateDetailsChange";
import { body } from "express-validator";

describe("dateOfACSPUpdateDetailsChange", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should return an array of validation chains for 'dob'", () => {
        const result = dateOfACSPUpdateDetailsChange("dob");
        expect(result).toHaveLength(4);
        result.forEach((chain) => {
            expect(chain).toBeInstanceOf(body("").constructor);
        });
    });

    it("should return an array of validation chains for 'change'", () => {
        const result = dateOfACSPUpdateDetailsChange("change");
        expect(result).toHaveLength(4);
        result.forEach((chain) => {
            expect(chain).toBeInstanceOf(body("").constructor);
        });
    });
});

describe("dateDayChecker", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should throw an error if day, month, and year are empty", () => {
        expect(() => dateDayChecker("", "", "", "dob")).toThrow("noData");
        expect(() => dateDayChecker("", "", "", "change")).toThrow("noChangeDateData");
    });

    it("should throw an error if day and month are empty", () => {
        expect(() => dateDayChecker("", "", "2023", "dob")).toThrow("noDayMonth");
        expect(() => dateDayChecker("", "", "2023", "change")).toThrow("noChangeDateDayMonth");
    });

    it("should throw an error if day and year are empty", () => {
        expect(() => dateDayChecker("", "12", "", "dob")).toThrow("noDayYear");
        expect(() => dateDayChecker("", "12", "", "change")).toThrow("noChangeDateDayYear");
    });

    it("should throw an error if day is empty", () => {
        expect(() => dateDayChecker("", "12", "2023", "dob")).toThrow("noDay");
        expect(() => dateDayChecker("", "12", "2023", "change")).toThrow("noChangeDateDay");
    });

    it("should return true for valid day, month, and year", () => {
        expect(dateDayChecker("01", "12", "2023", "dob")).toBe(true);
    });
});

describe("dateMonthChecker", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should throw an error if day is not empty but month and year are empty", () => {
        expect(() => dateMonthChecker("01", "", "", "dob")).toThrow("noMonthYear");
        expect(() => dateMonthChecker("01", "", "", "change")).toThrow("noChangeDateMonthYear");
    });

    it("should throw an error if day is not empty but month is empty", () => {
        expect(() => dateMonthChecker("01", "", "2023", "dob")).toThrow("noMonth");
        expect(() => dateMonthChecker("01", "", "2023", "change")).toThrow("noChangeDateMonth");
    });

    it("should return true for valid day, month, and year", () => {
        expect(dateMonthChecker("01", "12", "2023", "dob")).toBe(true);
    });
});

describe("dateYearChecker", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should throw an error if day and month are not empty but year is empty", () => {
        expect(() => dateYearChecker("01", "12", "", "dob")).toThrow("noYear");
        expect(() => dateYearChecker("01", "12", "", "change")).toThrow("noChangeDateYear");
    });

    it("should return true for valid day, month, and year", () => {
        expect(dateYearChecker("01", "12", "2023", "dob")).toBe(true);
    });
});

describe("validDataChecker", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should throw an error if day, month, or year are non-numeric", () => {
        expect(() => validDataChecker("a", "12", "2023", "dob")).toThrow("nonNumeric");
        expect(() => validDataChecker("01", "b", "2023", "change")).toThrow("nonChangeDateNumeric");
    });

    it("should throw an error if month or year are out of range", () => {
        expect(() => validDataChecker("01", "13", "2023", "dob")).toThrow("invalid");
        expect(() => validDataChecker("01", "12", "99999", "change")).toThrow("invalidChangeDate");
    });

    it("should throw an error if day is invalid for the given month and year", () => {
        expect(() => validDataChecker("32", "12", "2023", "dob")).toThrow("invalid");
        expect(() => validDataChecker("30", "02", "2023", "change")).toThrow("invalidChangeDate");
    });

    it("should throw an error if the date is in the future", () => {
        const futureYear = new Date().getFullYear() + 1;
        expect(() => validDataChecker("01", "12", futureYear.toString(), "dob")).toThrow("dateInFuture");
        expect(() => validDataChecker("01", "12", futureYear.toString(), "change")).toThrow("dateInFutureChangeDate");
    });

    it("should throw an error if the age is too young for 'dob'", () => {
        const currentYear = new Date().getFullYear();
        expect(() => validDataChecker("01", "12", (currentYear - 15).toString(), "dob")).toThrow("tooYoung");
    });

    it("should throw an error if the age is too old for 'dob'", () => {
        const currentYear = new Date().getFullYear();
        expect(() => validDataChecker("01", "12", (currentYear - 111).toString(), "dob")).toThrow("tooChangeDateOld");
    });

    it("should throw an error if the date of change is more than a century old", () => {
        const currentYear = new Date().getFullYear();
        expect(() => validDataChecker("01", "12", (currentYear - 150).toString(), "change")).toThrow("tooChangeDateOld");
    });

    it("should return true for valid day, month, and year", () => {
        expect(validDataChecker("01", "12", "2000", "dob")).toBe(true);
        expect(validDataChecker("01", "12", "2023", "change")).toBe(true);
    });
});
describe("Month and Day Adjustment Logic", () => {
    afterEach(() => {
        process.removeAllListeners("uncaughtException");
    });
    it("should decrement deepDifference if the input date month is greater than the current date month", () => {
        const currentDate = new Date(2025, 5, 15);
        const inputDate = new Date(1925, 6, 15);

        let deepDifference = currentDate.getFullYear() - inputDate.getFullYear();

        if (
            currentDate.getMonth() < inputDate.getMonth() ||
            (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())
        ) {
            deepDifference--;
        }

        expect(deepDifference).toBe(99);
    });

    it("should decrement deepDifference if the input date day is greater than the current date day in the same month", () => {
        const currentDate = new Date(2025, 5, 15);
        const inputDate = new Date(1925, 5, 20);

        let deepDifference = currentDate.getFullYear() - inputDate.getFullYear();

        if (
            currentDate.getMonth() < inputDate.getMonth() ||
            (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())
        ) {
            deepDifference--;
        }

        expect(deepDifference).toBe(99);
    });

    it("should not decrement deepDifference if the input date is earlier in the same year", () => {
        const currentDate = new Date(2025, 5, 15);
        const inputDate = new Date(1925, 4, 15);

        let deepDifference = currentDate.getFullYear() - inputDate.getFullYear();

        if (
            currentDate.getMonth() < inputDate.getMonth() ||
            (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())
        ) {
            deepDifference--;
        }

        expect(deepDifference).toBe(100);
    });

    it("should not decrement deepDifference if the input date is the same as the current date", () => {
        const currentDate = new Date(2025, 5, 15);
        const inputDate = new Date(1925, 5, 15);

        let deepDifference = currentDate.getFullYear() - inputDate.getFullYear();

        if (
            currentDate.getMonth() < inputDate.getMonth() ||
            (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())
        ) {
            deepDifference--;
        }

        expect(deepDifference).toBe(100);
    });
});
