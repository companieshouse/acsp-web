const nameErrorManifest = {
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
            summary: "Enter your full name",
            inline: "Enter your full name"
        },
        noFirstName: {
            summary: "Enter your first name",
            inline: "Enter your first name"
        },
        noLastName: {
            summary: "Enter your last name",
            inline: "Enter your last name"
        },
        firstName: {
            summary: "First name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes",
            inline: "First name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes"
        },
        middleName: {
            summary: "Middle name or names must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes",
            inline: "Middle name or names must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes"
        },
        lastName: {
            summary: "Last name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes",
            inline: "Last name must only include letters a to z, and common special characters such as hyphens, spaces and apostrophes"
        },
        firstNameLength: {
            summary: "First name must be 50 characters or fewer",
            inline: "First name must be 50 characters or fewer"
        },
        middleNameLength: {
            summary: "Middle names must be 50 characters or fewer",
            inline: "Middle names must be 50 characters or fewer"
        },
        lastNameLength: {
            summary: "Last name must be 160 characters or fewer",
            inline: "Last name must be 160 characters or fewer"
        }
    }
};

export default nameErrorManifest;
