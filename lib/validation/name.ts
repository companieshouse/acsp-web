import { body } from "express-validator";
import nameErrorManifest from "../utils/error_manifests/name";

export const nameValidator = [
    body("first-name").custom((value, { req }) => firstNameChecker(req.body["first-name"], req.body["last-name"])).bail().isLength({ max: 50 }).withMessage(nameErrorManifest.validation.firstNameLength.summary),
    body("middle-names").custom((value, { req }) => middleNameChecker(req.body["middle-names"])).bail().isLength({ max: 50 }).withMessage(nameErrorManifest.validation.middleNameLength.summary),
    body("last-name").custom((value, { req }) => lastNameChecker(req.body["first-name"], req.body["last-name"])).bail().isLength({ max: 160 }).withMessage(nameErrorManifest.validation.lastNameLength.summary)
];

export const firstNameChecker = (firstName: string, lastName: string) => {
    firstName = firstName.trim();
    lastName = lastName.trim();
    if (firstName === "" && lastName === "") {
        throw new Error(nameErrorManifest.validation.noData.summary);
    } else if (firstName === "" && lastName !== "") {
        throw new Error(nameErrorManifest.validation.noFirstName.summary);
    } else if (firstName !== "" && !isValidName(firstName)) {
        throw new Error(nameErrorManifest.validation.firstName.summary);
    }
    return true;
};

export const lastNameChecker = (firstName: string, lastName: string) => {
    firstName = firstName.trim();
    lastName = lastName.trim();
    if (firstName !== "" && lastName === "") {
        throw new Error(nameErrorManifest.validation.noLastName.summary);
    } else if (lastName !== "" && !isValidName(lastName)) {
        throw new Error(nameErrorManifest.validation.lastName.summary);
    }
    return true;
};

export const middleNameChecker = (middleName: string) => {
    middleName = middleName.trim();
    if (middleName !== "" && !isValidName(middleName)) {
        throw new Error(nameErrorManifest.validation.middleName.summary);
    }
    return true;
};

export const isValidName = (name: string): boolean => {
    const regex = /^[a-zA-Z \-']{1,160}$/ig;
    return regex.test(name);
};
