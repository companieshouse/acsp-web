import { body } from "express-validator";

export const dateOfACSPUpdateDetailsChange = [
    body("change-day").custom((value, { req }) => dateDayChecker(req.body["change-day"], req.body["change-month"], req.body["change-year"])),
    body("change-month").custom((value, { req }) => dateMonthChecker(req.body["change-day"], req.body["change-month"], req.body["change-year"])),
    body("change-year").custom((value, { req }) => dateYearChecker(req.body["change-day"], req.body["change-month"], req.body["change-year"])),
    body("change-day").custom((value, { req }) => validDataChecker(req.body["change-day"], req.body["change-month"], req.body["change-year"]))
];

export const dateDayChecker = (day: string, month: string, year: string) => {
    if (day.trim() === "" && month.trim() === "" && year.trim() === "") {
        throw new Error("noChangeDateData");
    } else if (day.trim() === "" && month.trim() === "") {
        throw new Error("noChangeDateDayMonth");
    } else if (day.trim() === "" && year.trim() === "") {
        throw new Error("noChangeDateDayYear");
    } else if (day.trim() === "") {
        throw new Error("noChangeDateDay");
    }
    return true;
};

export const dateMonthChecker = (day: string, month: string, year: string) => {
    if (day.trim() !== "" && month.trim() === "" && year.trim() === "") {
        throw new Error("noChangeDateMonthYear");
    } else if (day.trim() !== "" && month.trim() === "") {
        throw new Error("noChangeDateMonth");
    }
    return true;
};

export const dateYearChecker = (day: string, month: string, year: string) => {
    if (day.trim() !== "" && month.trim() !== "" && year.trim() === "") {
        throw new Error("noChangeDateYear");
    }
    return true;
};

export const validDataChecker = (day: string, month: string, year: string) => {
    if (day !== "" && month !== "" && year !== "") {
        if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) {
            throw new Error("nonNumericChangeDate");
        } else if (+month < 1 || +month > 12 || +year < 1000 || +year > 9999 || !isValidDay(+day, +month, +year) || day.length > 2 || month.length > 2) {
            throw new Error("invalidChangeDate");
        } else if (!isNotInFuture(+day, +month, +year)) {
            throw new Error("dateInFutureChangeDate");
        } else if (!isNotTooOld(+day, +month, +year)) {
            throw new Error("tooOldChangeDate");
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
