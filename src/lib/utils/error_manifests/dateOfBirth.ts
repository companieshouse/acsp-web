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
        noPropertyDetails: {
            summary: "Enter a property name or number",
            inline: "Enter a property name or number"
        },
        noAddressLine1: {
            summary: "Enter an address",
            inline: "Enter an address"
        },
        noCityOrTown: {
            summary: "Enter a city or town",
            inline: "Enter a city or town"
        },
        noPostCode: {
            summary: "Enter a postcode",
            inline: "Enter a postcode"
        },
        invalidPropertyDetails: {
            summary: "Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes",
            inline: "Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes"
        },
        invalidAddressLine1: {
            summary: "Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes",
            inline: "Address line 1 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes"
        },
        invalidAddressLine2: {
            summary: "Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes",
            inline: "Address line 2 must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes"
        },
        invalidAddressTown: {
            summary: "City or town must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes",
            inline: "City or town must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes"
        },
        invalidAddressCounty: {
            summary: "County or region must only include letters a to z",
            inline: "County or region must only include letters a to z"
        },
        invalidAddressCountry: {
            summary: "Country must only include letters a to z",
            inline: "Country must only include letters a to z"
        },
        invalidAddressPostcode: {
            summary: "Enter a full UK postcode",
            inline: "Enter a full UK postcode"
        },
        invalidPropertyDetailsLength: {
            summary: "Property name or number must be 200 characters or less",
            inline: "Property name or number must be 200 characters or less"
        },
        invalidAddressLine1Length: {
            summary: "Address line 1 must be 50 characters or less",
            inline: "Address line 1 must be 50 characters or less"
        },
        invalidAddressLine2Length: {
            summary: "Address line 2 must be 50 characters or less",
            inline: "Address line 2 must be 50 characters or less"
        },
        invalidAddressTownLength: {
            summary: "City or town must be 50 characters or less",
            inline: "City or town must be 50 characters or less"
        },
        invalidAddressCountyLength: {
            summary: "County or region must be 50 characters or less",
            inline: "County or region must be 50 characters or less"
        },
        invalidAddressCountryLength: {
            summary: "Country must be 50 characters or less",
            inline: "Country must be 50 characters or less"
        }
    }
};

export default dateOfBirthErrorManifest;
