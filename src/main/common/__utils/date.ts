import { DateTime } from "luxon";
import { createAndLogError } from "./logger";
import { CompanyOfficer } from "@companieshouse/api-sdk-node/dist/services/officer-filing";
import { formatAppointmentDate } from "./format";

export const toReadableFormat = (dateToConvert: string | undefined, lang = "en"): string => {
    if (!dateToConvert) {
        return "";
    }
    const jsDate = new Date(dateToConvert);
    const dateTime = DateTime.fromJSDate(jsDate);
    let convertedDate;
    switch (lang) {
    case "cy":
        convertedDate = dateTime.setLocale("cy").toFormat("d MMMM yyyy");
        break;
    case "en":
    default:
        convertedDate = dateTime.setLocale("en").toFormat("d MMMM yyyy");
        break;
    }
    if (convertedDate === "Invalid DateTime") {
        throw createAndLogError(`Unable to convert provided date ${dateToConvert}`);
    }

    return convertedDate;
};

export const isInFuture = (dateToCheckISO: string): boolean => {
    const today: DateTime = DateTime.now();
    const dateToCheck: DateTime = DateTime.fromISO(dateToCheckISO);
    const timeUnitDay = "day";

    return dateToCheck.startOf(timeUnitDay) > today.startOf(timeUnitDay);
};

export const toReadableFormatMonthYear = (monthNum: number, year: number): string => {
    const datetime = DateTime.fromObject({ month: monthNum });
    const convertedMonth = datetime.toFormat("MMMM");

    if (convertedMonth === "Invalid DateTime") {
        throw createAndLogError(`toReadableFormatMonthYear() - Unable to convert provided month ${monthNum}`);
    }

    return `${convertedMonth} ${year}`;
};

export const setAppointedOnDate = (officer: CompanyOfficer): string => {
    var appointedOn = formatAppointmentDate(officer.appointedOn);
    if (appointedOn === "") {
        appointedOn = "Before 1992";
    }
    return appointedOn;
};

export const buildDateString = (day: string, month: string, year: string): string => {
    return year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0"); // Get date in the format yyyy-mm-dd
};
