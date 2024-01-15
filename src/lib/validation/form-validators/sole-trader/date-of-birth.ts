import soleTraderErrorManifest from "../../../utils/error_manifests/sole-trader";
import { GenericValidator } from "../../generic";

export class DateOfBirthValidator extends GenericValidator {

    soleTraderErrorManifest: any;

    constructor (classParam?: string) {
        super();
        this.errorManifest = soleTraderErrorManifest;
    }

    validateInputData (payload: any): Promise<any> {
        try {
            var dobDay = +payload.dobDay;
            var dobMonth = +payload.dobMonth;
            var dobYear = +payload.dobYear;

            if (payload.dobDay === "" && payload.dobMonth === "" && payload.dobYear === "") {
                this.errors.stack.noData = this.errorManifest.validation.noData;
            } else if (payload.dobDay === "" && payload.dobMonth === "") {
                this.errors.stack.noData = this.errorManifest.validation.noDayMonth;
            } else if (payload.dobDay === "" && payload.dobYear === "") {
                this.errors.stack.noData = this.errorManifest.validation.noDayYear;
            } else if (payload.dobMonth === "" && payload.dobYear === "") {
                this.errors.stack.noData = this.errorManifest.validation.noMonthYear;
            } else if (payload.dobDay === "") {
                this.errors.stack.noData = this.errorManifest.validation.noDay;
            } else if (payload.dobMonth === "") {
                this.errors.stack.noData = this.errorManifest.validation.noMonth;
            } else if (payload.dobYear === "") {
                this.errors.stack.noData = this.errorManifest.validation.noYear;
            } else if (!this.isValidMonth(dobMonth)) {
                this.errors.stack.invalidDate = this.errorManifest.validation.invalid;
            } else if (!this.isValidYear(dobYear)) {
                this.errors.stack.invalidDate = this.errorManifest.validation.invalid;
            } else if (!this.isValidDay(dobDay, dobMonth, dobYear)) {
                this.errors.stack.invalidDate = this.errorManifest.validation.invalid;
            } else if (!this.isNotInFuture(dobDay, dobMonth, dobYear)) {
                this.errors.stack.dateInFuture = this.errorManifest.validation.dateInFuture;
            } else if (!this.isNotTooOld(dobDay, dobMonth, dobYear)) {
                this.errors.stack.age = this.errorManifest.validation.tooOld;
            } else if (!this.isNotTooYoung(dobDay, dobMonth, dobYear)) {
                this.errors.stack.age = this.errorManifest.validation.tooYoung;
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
