import {
    dateDayChecker,
    dateMonthChecker,
    dateYearChecker,
    validDataChecker,
    isNotTooYoung,
    isNotTooOld
} from "../../../src/validation/dateOfACSPUpdateDetailsChange";

describe("Missing input validation tests", () => {
    test("Error if date field is completely empty", () => {
        expect(() => dateDayChecker("", "", "", "dob")).toThrow(new Error("noData"));
    });

    test("Error if date field is completely empty", () => {
        expect(() => dateDayChecker("", "", "", "change")).toThrow(new Error("noChangeDateData"));
    });

    test("Error if day and month fields are empty", () => {
        expect(() => dateDayChecker("", "", "1999", "dob")).toThrow(new Error("noDayMonth"));
    });

    test("Error if day and month fields are empty", () => {
        expect(() => dateDayChecker("", "", "1999", "change")).toThrow(new Error("noChangeDateMonth"));
    });

    test("Error if day and year fields are empty", () => {
        expect(() => dateDayChecker("", "02", "", "dob")).toThrow(new Error("noDayYear"));
    });

    test("Error if day and year fields are empty", () => {
        expect(() => dateDayChecker("", "02", "", "change")).toThrow(new Error("noChangeDateYear"));
    });

    test("Error if month and year fields are empty", () => {
        expect(() => dateMonthChecker("11", "", "", "dob")).toThrow(new Error("noMonthYear"));
    });

    test("Error if month and year fields are empty", () => {
        expect(() => dateMonthChecker("11", "", "", "change")).toThrow(new Error("noChangeDateDayMonth"));
    });

    test("Error if day field is empty", () => {
        expect(() => dateDayChecker("", "02", "1999", "dob")).toThrow(new Error("noDay"));
    });

    test("Error if day field is empty", () => {
        expect(() => dateDayChecker("", "02", "1999", "change")).toThrow(new Error("noChangeDateDay"));
    });

    test("Error if month field is empty", () => {
        expect(() => dateMonthChecker("11", "", "1999", "dob")).toThrow(new Error("noMonth"));
    });

    test("Error if month field is empty", () => {
        expect(() => dateMonthChecker("11", "", "1999", "change")).toThrow(new Error("noChangeDateMonthYear"));
    });

    test("Error if year field is empty", () => {
        expect(() => dateYearChecker("11", "02", "", "dob")).toThrow(new Error("noYear"));
    });

    test("Error if year field is empty", () => {
        expect(() => dateYearChecker("11", "02", "", "change")).toThrow(new Error("noChangeDateDayYear"));
    });

    test("No error if all fields are input", () => {
        expect(() => dateDayChecker("11", "02", "1999", "dob")).toBeTruthy();
        expect(() => dateMonthChecker("11", "02", "1999", "dob")).toBeTruthy();
        expect(() => dateYearChecker("11", "02", "1999", "dob")).toBeTruthy();
    });
});

describe("Valid data input tests", () => {
    test("Error if year is greater than 9999", () => {
        expect(() => validDataChecker("11", "11", "10000", "dob")).toThrow(new Error("invalid"));
    });

    test("Error if year is less than 1000", () => {
        expect(() => validDataChecker("11", "11", "999", "dob")).toThrow(new Error("invalid"));
    });

    test("Error if month is greater than 12", () => {
        expect(() => validDataChecker("11", "13", "1999", "dob")).toThrow(new Error("invalid"));
    });

    test("Error if day is not valid for month", () => {
        expect(() => validDataChecker("30", "02", "1999", "dob")).toThrow(new Error("invalid"));
    });

    test("Error if date given is in the future", () => {
        expect(() => validDataChecker("30", "11", "3490", "dob")).toThrow(new Error("dateInFuture"));
    });

    test("Error if date given is in the future", () => {
        expect(() => validDataChecker("30", "11", "3490", "change")).toThrow(new Error("dateInFutureChangeDate"));
    });

    test("Error if date given is more than 110 years ago", () => {
        expect(() => validDataChecker("30", "11", "1490", "dob")).toThrow(new Error("tooChangeDateOld"));
    });

    test("Error if date given is less than 16 years ago", () => {
        expect(() => validDataChecker("29", "01", "2024", "dob")).toThrow(new Error("tooYoung"));
    });

    test("Error if date given is non-numeric", () => {
        expect(() => validDataChecker("a", "01", "2024", "dob")).toThrow(new Error("nonNumeric"));
    });

    test("Error if date given is non-numeric", () => {
        expect(() => validDataChecker("a", "01", "2024", "change")).toThrow(new Error("nonChangeDateNumeric"));
    });

    test("No error for valid date within acceptable range", () => {
        expect(() => validDataChecker("15", "07", "2000", "dob")).toBeTruthy();
    });

    test("Error if day length is more than 2 digits", () => {
        expect(() => validDataChecker("123", "01", "2024", "dob")).toThrow(new Error("invalid"));
    });

    test("Error if day length is more than 2 digits", () => {
        expect(() => validDataChecker("123", "01", "2024", "change")).toThrow(new Error("invalidChangeDate"));
    });

    test("Error if month is zero", () => {
        expect(() => validDataChecker("11", "00", "1999", "dob")).toThrow(new Error("invalid"));
    });

    test("Error if day is zero", () => {
        expect(() => validDataChecker("00", "01", "1999", "dob")).toThrow(new Error("invalid"));
    });

    test("Leap year test: valid leap day", () => {
        expect(() => validDataChecker("29", "02", "2020", "dob")).toBeTruthy();
    });

    test("Leap year test: invalid leap day", () => {
        expect(() => validDataChecker("29", "02", "2019", "dob")).toThrow(new Error("invalid"));
    });

    test("Boundary test: 110 years ago exactly", () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear() - 110;
        const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
        const day = (`0${currentDate.getDate()}`).slice(-2);
        expect(() => validDataChecker(day, month, year.toString(), "dob")).toBeTruthy();
    });

    test("Boundary test: 16 years ago exactly", () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear() - 16;
        const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
        const day = (`0${currentDate.getDate()}`).slice(-2);
        expect(() => validDataChecker(day, month, year.toString(), "dob")).toBeTruthy();
    });

    test("Error if year has non-numeric characters", () => {
        expect(() => validDataChecker("11", "01", "20a0", "dob")).toThrow(new Error("nonNumeric"));
    });

    test("Error if month has non-numeric characters", () => {
        expect(() => validDataChecker("11", "a1", "2020", "dob")).toThrow(new Error("nonNumeric"));
    });

    test("Error if day has non-numeric characters", () => {
        expect(() => validDataChecker("1a", "01", "2020", "dob")).toThrow(new Error("nonNumeric"));
    });
});

describe("Age calculation tests", () => {
    test("Calculate age - current date is greater than input date", () => {
        const currentDate = new Date();
        const inputDate = new Date("2000-07-01");
        expect(isNotTooOld(inputDate.getDate(), inputDate.getMonth() + 1, inputDate.getFullYear())).toBe(true);
    });

    test("Calculate age - current date is exactly 16 years ago", () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear() - 16;
        const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
        const day = (`0${currentDate.getDate()}`).slice(-2);
        expect(isNotTooYoung(+day, +month, +year.toString())).toBe(true);
    });

    test("Calculate age - current date is less than 16 years ago", () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear() - 15;
        const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
        const day = (`0${currentDate.getDate()}`).slice(-2);
        expect(isNotTooYoung(+day, +month, +year.toString())).toBe(false);
    });
});
