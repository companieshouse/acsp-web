const dateOfBirthErrorManifest = {
    generic: {
        serverError: {
            summary: "There was an error processing your request. Please try again."
        }
    },
    validation: {
        default: {
            summary: "Your request contains validation errors",
            inline: "Your request contains validation errors"
        },
        invalid: {
            summary: "Date of birth must be a real date",
            inline: "Date of birth must be a real date"
        },
        dateInFuture: {
            summary: "The date of birth must be in the past",
            inline: "The date of birth must be in the past"
        },
        noData: {
            summary: "Enter your date of birth",
            inline: "Enter your date of birth"
        },
        noDayMonth: {
            summary: "Date of birth must include a day and a month",
            inline: "Date of birth must include a day and a month"
        },
        noDayYear: {
            summary: "Date of birth must include a day and a year",
            inline: "Date of birth must include a day and a year"
        },
        noMonthYear: {
            summary: "Date of birth must include a month and a year",
            inline: "Date of birth must include a month and a year"
        },
        noDay: {
            summary: "Date of birth must include a day",
            inline: "Date of birth must include a day"
        },
        noMonth: {
            summary: "Date of birth must include a month",
            inline: "Date of birth must include a month"
        },
        noYear: {
            summary: "Date of birth must include a year",
            inline: "Date of birth must include a year"
        },
        tooOld: {
            summary: "You must be less than 110 years old",
            inline: "You must be less than 110 years old"
        },
        tooYoung: {
            summary: "You must be at least 16 years old",
            inline: "You must be at least 16 years old"
        },
        nonNumeric: {
            summary: "Date of birth must only include numbers",
            inline: "Date of birth must only include numbers"
        }
    }
};

export default dateOfBirthErrorManifest;
