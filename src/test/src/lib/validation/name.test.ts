import nameErrorManifest from "../../../../../lib/utils/error_manifests/name";
import { firstNameChecker, lastNameChecker, middleNameChecker } from "../../../../../lib/validation/name";

describe("Missing input validation tests", () => {
    test("Error if name fields are completely empty", async () => {
        expect(() => firstNameChecker("", "")).toThrow(new Error(nameErrorManifest.validation.noData.summary));
    });
    test("Error if first name field is empty", async () => {
        expect(() => firstNameChecker("", "Doe")).toThrow(new Error(nameErrorManifest.validation.noFirstName.summary));
    });
    test("Error if last name field is empty", async () => {
        expect(() => lastNameChecker("John", "")).toThrow(new Error(nameErrorManifest.validation.noLastName.summary));
    });
    test("No error if first and last name entered", async () => {
        expect(() => lastNameChecker("John", "Doe")).toBeTruthy();
    });
});

describe("Valid data input tests", () => {
    test("Error if first name field is not valid input", async () => {
        expect(() => firstNameChecker("J0hn&/", "Doe")).toThrow(new Error(nameErrorManifest.validation.firstName.summary));
    });
    test("Error if last name field is not valid input", async () => {
        expect(() => lastNameChecker("John", "DO&@")).toThrow(new Error(nameErrorManifest.validation.lastName.summary));
    });
    test("Error if middle names field is not valid input", async () => {
        expect(() => middleNameChecker("And?£*")).toThrow(new Error(nameErrorManifest.validation.middleName.summary));
    });
});
