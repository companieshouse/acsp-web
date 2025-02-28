import { dateDayChecker, dateMonthChecker, dateYearChecker, validDataChecker } from "../../../src/validation/dateOfACSPUpdateDetailsChange";

describe("dateDayChecker", () => {
    it("should throw error if day, month, and year are empty", () => {
        expect(() => dateDayChecker("", "", "")).toThrow("noChangeDateData");
    });

    it("should throw error if day and month are empty", () => {
        expect(() => dateDayChecker("", "", "2023")).toThrow("noChangeDateDayMonth");
    });

    it("should throw error if day and year are empty", () => {
        expect(() => dateDayChecker("", "12", "")).toThrow("noChangeDateDayYear");
    });

    it("should throw error if day is empty", () => {
        expect(() => dateDayChecker("", "12", "2023")).toThrow("noChangeDateDay");
    });

    it("should return true if day is provided", () => {
        expect(dateDayChecker("01", "12", "2023")).toBe(true);
    });
});

describe("dateMonthChecker", () => {
    it("should throw error if month and year are empty but day is provided", () => {
        expect(() => dateMonthChecker("01", "", "")).toThrow("noChangeDateMonthYear");
    });

    it("should throw error if month is empty but day is provided", () => {
        expect(() => dateMonthChecker("01", "", "2023")).toThrow("noChangeDateMonth");
    });

    it("should return true if month is provided", () => {
        expect(dateMonthChecker("01", "12", "2023")).toBe(true);
    });
});

describe("dateYearChecker", () => {
    it("should throw error if year is empty but day and month are provided", () => {
        expect(() => dateYearChecker("01", "12", "")).toThrow("noChangeDateYear");
    });

    it("should return true if year is provided", () => {
        expect(dateYearChecker("01", "12", "2023")).toBe(true);
    });
});

describe("validDataChecker", () => {
    it("should throw error if day, month, and year are non-numeric", () => {
        expect(() => validDataChecker("a", "b", "c")).toThrow("nonNumericChangeDate");
    });

    it("should throw error if month is out of range", () => {
        expect(() => validDataChecker("01", "13", "2023")).toThrow("invalidChangeDate");
    });

    it("should throw error if year is out of range", () => {
        expect(() => validDataChecker("01", "12", "999")).toThrow("invalidChangeDate");
    });

    it("should throw error if day is invalid for the given month and year", () => {
        expect(() => validDataChecker("32", "12", "2023")).toThrow("invalidChangeDate");
    });

    it("should throw error if date is in the future", () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        expect(() => validDataChecker(futureDate.getDate().toString(), (futureDate.getMonth() + 1).toString(), futureDate.getFullYear().toString())).toThrow("dateInFutureChangeDate");
    });

    it("should throw error if date is too old", () => {
        const oldDate = new Date();
        oldDate.setFullYear(oldDate.getFullYear() - 111);
        expect(() => validDataChecker(oldDate.getDate().toString(), (oldDate.getMonth() + 1).toString(), oldDate.getFullYear().toString())).toThrow("tooOldChangeDate");
    });

    it("should return true if date is valid", () => {
        expect(validDataChecker("01", "12", "2023")).toBe(true);
    });
});
