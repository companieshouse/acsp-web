const nationalityErrorManifest = {
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
        noNationality: {
            summary: "Enter your nationality",
            inline: "Enter your nationality"
        },
        invalid: {
            summary: "Select a nationality from the list",
            inline: "Select a nationality from the list"
        },

        doubleSecondNationality: {
            summary: "Enter a different second nationality",
            inline: "Enter a different second nationality"
        },
        doubleThirdNationality: {
            summary: "Enter a different third nationality",
            inline: "Enter a different third nationality"
        },
        charLimit1stNationality: {
            summary: "Nationality can be no longer than 50 characters",
            inline: "Nationality can be no longer than 50 characters"
        },
        charLimit2ndNationality: {
            summary: "For technical reasons, we are not able to accept dual nationalities with a total of more than 49 characters",
            inline: "For technical reasons, we are not able to accept dual nationalities with a total of more than 49 characters"
        },
        charLimit3rdNationality: {
            summary: "For technical reasons, we are not able to accept multiple nationalities with a total of more than 48 characters",
            inline: "For technical reasons, we are not able to accept multiple nationalities with a total of more than 48 characters"
        }

    }
};

export default nationalityErrorManifest;
