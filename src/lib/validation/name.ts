import nameErrorManifest from "../utils/error_manifests/name";
import { GenericValidator } from "./generic";

export class NameValidator extends GenericValidator {

    constructor (classParam?: string) {
        super();
        this.errorManifest = nameErrorManifest;
    }

    validateInputData (payload: any): Promise<any> {
        try {
            if (payload.firstName === "" && payload.lastName === "") {
                this.errors.stack.firstName = this.errorManifest.validation.noData;
            } else if (payload.firstName === "") {
                this.errors.stack.firstName = this.errorManifest.validation.noFirstName;
            } else if (payload.lastName === "") {
                this.errors.stack.lastName = this.errorManifest.validation.noLastName;
            }

            if ((payload.firstName).length > 50) {
                this.errors.stack.firstName = this.errorManifest.validation.firstNameLength;
            }
            if ((payload.middleName).length > 50) {
                this.errors.stack.middleName = this.errorManifest.validation.middleNameLength;
            }
            if ((payload.lastName).length > 160) {
                this.errors.stack.lastName = this.errorManifest.validation.lastNameLength;
            }

            if (!this.isValidName(payload.firstName) && payload.firstName !== "" && (payload.firstName).length <= 50) {
                this.errors.stack.firstName = this.errorManifest.validation.firstName;
            }
            if (!this.isValidName(payload.middleName) && payload.middleName !== "" && (payload.middleName).length <= 50) {
                this.errors.stack.middleName = this.errorManifest.validation.middleName;
            }
            if (!this.isValidName(payload.lastName) && payload.lastName !== "" && (payload.lastName).length <= 160) {
                this.errors.stack.lastName = this.errorManifest.validation.lastName;
            }

            if (!Object.keys(this.errors.stack).length) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(this.errors);
            }

        } catch (err) {
            this.errors.stack = this.errorManifest.generic.serverError;
            return Promise.reject(this.errors);
        }
    }

    isValidName (name: string): boolean {
        const regex = /^[a-zA-Z \\-\\']{1,160}$/ig;
        return regex.test(name);
    }
}
