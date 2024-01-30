const whereDoYouLiveErrorManifest = {
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
            summary: "Select where you live",
            inline: "Select where you live"
        }
    }
};

export default whereDoYouLiveErrorManifest;
