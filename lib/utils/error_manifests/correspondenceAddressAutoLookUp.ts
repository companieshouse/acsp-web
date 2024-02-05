const correspondenceAddressAutoLookUpErrorManifest = {
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
        noAddress: {
            summary: "Select the correspondence address",
            inline: "Select the correspondence address"
        },
        noPostCode: {
            summary: "Enter a postcode",
            inline: "Enter a postcode"
        },
        invalidPropertyDetails: {
            summary: "Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes",
            inline: "Property name or number must only include letters a to z, numbers and common special characters such as hyphens, spaces and apostrophes"
        },
        invalidAddressPostcode: {
            summary: "We cannot find this postcode. Enter a different one, or enter the address manually",
            inline: "We cannot find this postcode. Enter a different one, or enter the address manually"
        }

    }
};

export default correspondenceAddressAutoLookUpErrorManifest;
