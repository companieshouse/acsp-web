const correspondenceAddressListErrorManifest = {
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
            summary: "Select the correspondence address",
            inline: "Select the correspondence address"
        }
    }
};

export default correspondenceAddressListErrorManifest;
