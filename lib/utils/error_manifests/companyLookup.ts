const companyLookupErrorManifest = {
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

        noData: {
            summary: "Enter the company number",
            inline: "Enter the company number"
        },

        characterLimit: {
            summary: "Company number must be 8 characters",
            inline: "Company number must be 8 characters"
        },

        companyNumber: {
            summary: "Company number must only include letters a to z and numbers",
            inline: "Company number must only include letters a to z and numbers"
        }
    }
};

export default companyLookupErrorManifest;
