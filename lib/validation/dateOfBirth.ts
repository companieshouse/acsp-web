import { body } from "express-validator";
import dateOfBirthErrorManifest from "../utils/error_manifests/dateOfBirth";

export const dateOfBirthValidator = [
    body("dob-day").custom((value, { req }) => dateDayChecker(req.body["dob-day"], req.body["dob-month"], req.body["dob-year"])),
    body("dob-month").custom((value, { req }) => dateMonthChecker(req.body["dob-day"], req.body["dob-month"], req.body["dob-year"])),
    body("dob-year").custom((value, { req }) => dateYearChecker(req.body["dob-day"], req.body["dob-month"], req.body["dob-year"])),
    body("dob-day").custom((value, { req }) => validDataChecker(req.body["dob-day"], req.body["dob-month"], req.body["dob-year"]))
];

export const dateDayChecker = (day: string, month: string, year: string) => {
    if (day.trim() === "" && month.trim() === "" && year.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noData.summary);
    } else if (day.trim() === "" && month.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noDayMonth.summary);
    } else if (day.trim() === "" && year.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noDayYear.summary);
    } else if (day.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noDay.summary);
    }
    return true;
};

export const dateMonthChecker = (day: string, month: string, year: string) => {
    if (day.trim() !== "" && month.trim() === "" && year.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noMonthYear.summary);
    } else if (day.trim() !== "" && month.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noMonth.summary);
    }
    return true;
};

export const dateYearChecker = (day: string, month: string, year: string) => {
    if (day.trim() !== "" && month.trim() !== "" && year.trim() === "") {
        throw new Error(dateOfBirthErrorManifest.validation.noYear.summary);
    }
    return true;
};

export const validDataChecker = (day: string, month: string, year: string) => {
    if (day !== "" && month !== "" && year !== "") {
        if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) {
            throw new Error(dateOfBirthErrorManifest.validation.nonNumeric.summary);
        } else if (+month < 1 || +month > 12 || +year < 1000 || +year > 9999 || !isValidDay(+day, +month, +year) || day.length > 2 || month.length > 2) {
            throw new Error(dateOfBirthErrorManifest.validation.invalid.summary);
        } else if (!isNotInFuture(+day, +month, +year)) {
            throw new Error(dateOfBirthErrorManifest.validation.dateInFuture.summary);
        } else if (!isNotTooYoung(+day, +month, +year)) {
            throw new Error(dateOfBirthErrorManifest.validation.tooYoung.summary);
        } else if (!isNotTooOld(+day, +month, +year)) {
            throw new Error(dateOfBirthErrorManifest.validation.tooOld.summary);
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
    var currentDate = new Date();
    var inputDate = new Date(year, month - 1, day);

    if (inputDate > currentDate) {
        return false;
    }
    return true;
};

const isNotTooYoung = (day: number, month: number, year: number): boolean => {
    var currentDate = new Date();
    var inputDate = new Date(year, month - 1, day);
    var age = currentDate.getFullYear() - inputDate.getFullYear();

    if (currentDate.getMonth() < inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())) {
        age--;
    }
    return age >= 16;
};

const isNotTooOld = (day: number, month: number, year: number): boolean => {
    var currentDate = new Date();
    var inputDate = new Date(year, month - 1, day);
    var age = currentDate.getFullYear() - inputDate.getFullYear();

    if (currentDate.getMonth() > inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() > inputDate.getDate())) {
        age++;
    }
    return age <= 110;
};

const isNumeric = (number: string): boolean => {
    const regex = /^\d+$/ig;
    return regex.test(number);
};
