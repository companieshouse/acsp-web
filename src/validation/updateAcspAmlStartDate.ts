import { body } from "express-validator";

export const updateAmlStartDateValidator = [
    body("aml-start-day").custom((value, { req }) => dateDayChecker(req.body["aml-start-day"], req.body["dob-month"], req.body["aml-start-year"])),
    body("aml-start-month").custom((value, { req }) => dateMonthChecker(req.body["aml-start-day"], req.body["aml-start-month"], req.body["aml-start-year"])),
    body("aml-start-year").custom((value, { req }) => dateYearChecker(req.body["aml-start-day"], req.body["aml-start-month"], req.body["aml-start-year"])),
    body("aml-start-day").custom((value, { req }) => validDataChecker(req.body["aml-start-day"], req.body["aml-start-month"], req.body["aml-start-year"]))
];

export const dateDayChecker = (day: string, month: string, year: string) => {
    if (day.trim() === "" && month.trim() === "" && year.trim() === "") {
        throw new Error("noData");
    } else if (day.trim() === "" && month.trim() === "") {
        throw new Error("noDayMonth");
    } else if (day.trim() === "" && year.trim() === "") {
        throw new Error("noDayYear");
    } else if (day.trim() === "") {
        throw new Error("noDay");
    }
    return true;
};

export const dateMonthChecker = (day: string, month: string, year: string) => {
    if (day.trim() !== "" && month.trim() === "" && year.trim() === "") {
        throw new Error("noMonthYear");
    } else if (day.trim() !== "" && month.trim() === "") {
        throw new Error("noMonth");
    }
    return true;
};

export const dateYearChecker = (day: string, month: string, year: string) => {
    if (day.trim() !== "" && month.trim() !== "" && year.trim() === "") {
        throw new Error("noYear");
    }
    return true;
};

export const validDataChecker = (day: string, month: string, year: string) => {
    if (day !== "" && month !== "" && year !== "") {
        if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) {
            throw new Error("nonNumeric");
        } else if (+month < 1 || +month > 12 || isValidYear(+year) || !isValidDay(+day, +month, +year) || day.length > 2 || month.length > 2) {
            throw new Error("invalid");
        } else if (!isNotInFuture(+day, +month, +year)) {
            throw new Error("dateInFuture");
        }
    }
    return true;
};

const isValidDay = (day: number, month: number, year: number):boolean => {
    const numbDays = new Date(year, month, 0).getDate();
    if (day >= 1 && day <= numbDays) {
        return true;
    }
    return false;
};

const isNotInFuture = (day: number, month: number, year: number): boolean => {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);

    if (inputDate > currentDate) {
        return false;
    }
    return true;
};

const isNumeric = (number: string): boolean => {
    const regex = /^\d+$/ig;
    return regex.test(number);
};

const isValidYear = (year: number): boolean => {
    const currentYear = new Date().getFullYear();
    return year >= (currentYear - 100);
};
