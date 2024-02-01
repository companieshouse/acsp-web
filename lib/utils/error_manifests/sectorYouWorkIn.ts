const sectorYouWorkInErrorManifest = {
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
            summary: "Select which sector you work in",
            inline: "Select which sector you work in"
        }
    }
};

export default sectorYouWorkInErrorManifest;
