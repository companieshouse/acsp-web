import { body, ValidationChain } from "express-validator";

type ValidationType = "dob" | "change";

export const dateOfACSPUpdateDetailsChange = (type: ValidationType): ValidationChain[] => [
    body(`${type}-day`).custom((value, { req }) => dateDayChecker(req.body[`${type}-day`], req.body[`${type}-month`], req.body[`${type}-year`], type)),
    body(`${type}-month`).custom((value, { req }) => dateMonthChecker(req.body[`${type}-day`], req.body[`${type}-month`], req.body[`${type}-year`], type)),
    body(`${type}-year`).custom((value, { req }) => dateYearChecker(req.body[`${type}-day`], req.body[`${type}-month`], req.body[`${type}-year`], type)),
    body(`${type}-day`).custom((value, { req }) => validDataChecker(req.body[`${type}-day`], req.body[`${type}-month`], req.body[`${type}-year`], type))
];

export const dateDayChecker = (day: string, month: string | undefined, year: string, type: ValidationType): boolean => {

    if (day.trim() === "" && month === "" && year.trim() === "") {
        throw new Error(type === "dob" ? "noData" : "noChangeDateData");
    } else if (day.trim() === "" && month === "") {
        throw new Error(type === "dob" ? "noDayMonth" : "noChangeDateYear");
    } else if (day.trim() === "" && year.trim() === "") {
        throw new Error(type === "dob" ? "noDayYear" : "noChangeDateMonth");
    } else if (day.trim() === "") {
        throw new Error(type === "dob" ? "noDay" : "noChangeDateDay");
    }
    return true;
};

export const dateMonthChecker = (day: string, month: string | undefined, year: string, type: ValidationType): boolean => {

    if (day.trim() !== "" && month === "" && year.trim() === "") {
        throw new Error(type === "dob" ? "noMonthYear" : "noChangeDateMonthYear");
    } else if (day.trim() !== "" && month === "") {
        throw new Error(type === "dob" ? "noMonth" : "noChangeDateMonthYear");
    }
    return true;
};

export const dateYearChecker = (day: string, month: string | undefined, year: string, type: ValidationType): boolean => {

    if (day.trim() !== "" && month !== "" && year.trim() === "") {
        throw new Error(type === "dob" ? "noYear" : "noChangeDateDayYear");
    }
    return true;
};

export const validDataChecker = (day: string, month: string, year: string, type: ValidationType): boolean => {

    if (day !== "" && month !== "" && year !== "") {
        validateNumeric(day, month, year, type);
        validateMonthYearRange(month, year, type);
        validateDayLength(day, month, year, type);
        validateDate(day, month, year, type);
        if (type === "dob") {
            validateDobAge(day, month, year);
        } else if (type === "change") {
            validateDateOfChangeLimit(day, month, year);
        }
    }
    return true;
};

const validateNumeric = (day: string, month: string, year: string, type: ValidationType): void => {
    if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) {
        throw new Error(type === "dob" ? "nonNumeric" : "nonChangeDateNumeric");
    }
};

const validateMonthYearRange = (month: string, year: string, type: ValidationType): void => {
    if (+month < 1 || +month > 12 || +year < 1000 || +year > 9999) {
        throw new Error(type === "dob" ? "invalid" : "invalidChangeDate");
    }
};

const validateDayLength = (day: string, month: string, year: string, type: ValidationType): void => {
    if (!isValidDay(+day, +month, +year) || day.length > 2) {
        throw new Error(type === "dob" ? "invalid" : "invalidChangeDate");
    }
};

const validateDate = (day: string, month: string, year: string, type: ValidationType): void => {
    if (!isNotInFuture(+day, +month, +year)) {
        throw new Error(type === "dob" ? "dateInFuture" : "dateInFutureChangeDate");
    }
};

const validateDobAge = (day: string, month: string, year: string): void => {
    if (!isNotTooYoung(+day, +month, +year)) {
        throw new Error("tooYoung");
    }
    if (!isNotTooOld(+day, +month, +year)) {
        throw new Error("tooChangeDateOld");
    }
};

const validateDateOfChangeLimit = (day: string, month: string, year: string): void => {
    if (!notMoreThanACentury(+day, +month, +year)) {
        throw new Error("tooChangeDateOld");
    }
};

const isValidDay = (day: number, month: number, year: number): boolean => {
    const numbDays = new Date(year, month, 0).getDate();
    return day >= 1 && day <= numbDays;
};

const isNotInFuture = (day: number, month: number, year: number): boolean => {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);
    return inputDate <= currentDate;
};

export const isNotTooYoung = (day: number, month: number, year: number): boolean => {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);
    let age = currentDate.getFullYear() - inputDate.getFullYear();
    if (currentDate.getMonth() < inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())) {
        age--;
    }
    return age >= 16;
};

export const isNotTooOld = (day: number, month: number, year: number): boolean => {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);
    let age = currentDate.getFullYear() - inputDate.getFullYear();
    if (currentDate.getMonth() > inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() > inputDate.getDate())) {
        age++;
    }
    return age <= 110;
};

const notMoreThanACentury = (day: number, month: number, year: number): boolean => {
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day);
    let deepDifference = currentDate.getFullYear() - inputDate.getFullYear();
    if (currentDate.getMonth() < inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())) {
        deepDifference--;
    }
    return deepDifference <= 100;
};

const isNumeric = (number: string): boolean => {
    const regex = /^\d+$/;
    return regex.test(number);
};
