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
        }

    }
};

export default nationalityErrorManifest;
