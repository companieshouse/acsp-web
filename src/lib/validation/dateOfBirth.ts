import dateOfBirthErrorManifest from "../utils/error_manifests/dateOfBirth";
import { GenericValidator } from "./generic";

export class DateOfBirthValidator extends GenericValidator {

    constructor (classParam?: string) {
        super();
        this.errorManifest = dateOfBirthErrorManifest;
    }

    validateInputData (payload: any): Promise<any> {
        try {
            var dobDay = +payload.dobDay;
            var dobMonth = +payload.dobMonth;
            var dobYear = +payload.dobYear;

            if (payload.dobDay === "" && payload.dobMonth === "" && payload.dobYear === "") {
                this.errors.stack.dobDay = this.errorManifest.validation.noData;
            } else if (payload.dobDay === "" && payload.dobMonth === "") {
                this.errors.stack.dobDay = this.errorManifest.validation.noDayMonth;
            } else if (payload.dobDay === "" && payload.dobYear === "") {
                this.errors.stack.dobDay = this.errorManifest.validation.noDayYear;
            } else if (payload.dobMonth === "" && payload.dobYear === "") {
                this.errors.stack.dobMonth = this.errorManifest.validation.noMonthYear;
            } else if (payload.dobDay === "") {
                this.errors.stack.dobDay = this.errorManifest.validation.noDay;
            } else if (payload.dobMonth === "") {
                this.errors.stack.dobMonth = this.errorManifest.validation.noMonth;
            } else if (payload.dobYear === "") {
                this.errors.stack.dobYear = this.errorManifest.validation.noYear;
            } else if (!this.isNotTooYoung(dobDay, dobMonth, dobYear) && this.isValidYear(dobYear)) {
                this.errors.stack.dobDay = this.errorManifest.validation.tooYoung;
            } else if (!this.isNotInFuture(dobDay, dobMonth, dobYear) && this.isValidYear(dobYear)) {
                this.errors.stack.dobDay = this.errorManifest.validation.dateInFuture;
            } else if (!this.isNotTooOld(dobDay, dobMonth, dobYear) && this.isValidYear(dobYear)) {
                this.errors.stack.dobDay = this.errorManifest.validation.tooOld;
            }

            if (!this.isValidMonth(dobMonth) && payload.dobMonth !== "") {
                this.errors.stack.dobMonth = this.errorManifest.validation.invalid;
            }
            if (!this.isValidYear(dobYear) && payload.dobYear !== "") {
                this.errors.stack.dobYear = this.errorManifest.validation.invalid;
            }
            if (!this.isValidDay(dobDay, dobMonth, dobYear) && payload.dobDay !== "" && payload.dobMonth !== "" && payload.dobYear !== "") {
                this.errors.stack.dobDay = this.errorManifest.validation.invalid;
            }

            if (!Object.keys(this.errors.stack).length) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(this.errors);
            }

        } catch (error) {
            this.errors.stack = this.errorManifest.generic.serverError;
            return Promise.reject(this.errors);
        }
    }

    isValidMonth (month: number):boolean {
        if (typeof month !== "number") {
            return false;
        } else if (month < 1 || month > 12) {
            return false;
        }
        return true;
    }

    isValidYear (year: number):boolean {
        if (typeof year !== "number") {
            return false;
        } else if (year < 1000 || year > 9999) {
            return false;
        }
        return true;
    }

    isValidDay (day: number, month: number, year: number): boolean {
        var numDays = new Date(year, month, 0).getDate();
        if (typeof day !== "number") {
            return false;
        }
        if (day < 1 || day > numDays) {
            return false;
        }
        return true;
    }

    isNotInFuture (day: number, month: number, year: number): boolean {
        var currentDate = new Date();
        var inputDate = new Date(year, month - 1, day);

        if (inputDate > currentDate) {
            return false;
        }
        return true;
    }

    isNotTooYoung (day: number, month: number, year: number): boolean {
        var currentDate = new Date();
        var inputDate = new Date(year, month - 1, day);
        var age = currentDate.getFullYear() - inputDate.getFullYear();

        if (currentDate.getMonth() < inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() < inputDate.getDate())) {
            age--;
        }
        return age >= 16;
    }

    isNotTooOld (day: number, month: number, year: number): boolean {
        var currentDate = new Date();
        var inputDate = new Date(year, month - 1, day);
        var age = currentDate.getFullYear() - inputDate.getFullYear();

        if (currentDate.getMonth() > inputDate.getMonth() || (currentDate.getMonth() === inputDate.getMonth() && currentDate.getDate() > inputDate.getDate())) {
            age++;
        }
        return age <= 110;
    }

};
