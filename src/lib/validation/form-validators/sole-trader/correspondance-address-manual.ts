import soleTraderErrorManifest from "../../../utils/error_manifests/sole-trader";
import { GenericValidator } from "../../generic";

export class CorrespondanceAddressManualValidator extends GenericValidator {

    soleTraderErrorManifest: any;

    constructor (classParam?: string) {
        super();
        this.errorManifest = soleTraderErrorManifest;
    }

    validateInputData (payload: any): Promise<any> {
        try {
            var addressTownFormat = /^[A-Za-z0-9\-',\s!]*$/;
            var addressCountyFormat = /^[A-Za-z]*$/;
            var addressUKPostcodeFormat = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;
            var otherAddressDetailsFormat = /^[A-Za-z0-9\-',\s]*$/;

            var addressPropertyDetailsLength = 200;
            var otherAddressDetailsLength = 50;

            if (payload.addressPropertyDetails === "") {
                this.errors.stack.addressPropertyDetails = this.errorManifest.validation.noPropertyDetails;
            } else if (!this.isValidFormat(payload.addressPropertyDetails, otherAddressDetailsFormat)) {
                this.errors.stack.addressPropertyDetails = this.errorManifest.validation.invalidPropertyDetails;
            } else if (!this.isValidLength(payload.addressPropertyDetails, addressPropertyDetailsLength)) {
                this.errors.stack.addressPropertyDetails = this.errorManifest.validation.invalidPropertyDetailsLength;
            }

            if (payload.addressLine1 === "") {
                this.errors.stack.addressLine1 = this.errorManifest.validation.noAddressLine1;
            } else if (!this.isValidFormat(payload.addressLine1, otherAddressDetailsFormat)) {
                this.errors.stack.addressLine1 = this.errorManifest.validation.invalidAddressLine1;
            } else if (!this.isValidLength(payload.addressLine1, otherAddressDetailsLength)) {
                this.errors.stack.addressLine1 = this.errorManifest.validation.invalidAddressLine1Length;
            }

            if (!this.isValidFormat(payload.addressLine2, otherAddressDetailsFormat)) {
                this.errors.stack.addressLine2 = this.errorManifest.validation.invalidAddressLine2;
            } else if (!this.isValidLength(payload.addressLine2, otherAddressDetailsLength)) {
                this.errors.stack.addressLine2 = this.errorManifest.validation.invalidAddressLine2Length;
            }

            if (payload.addressTown === "") {
                this.errors.stack.addressTown = this.errorManifest.validation.noCityOrTown;
            } else if (!this.isValidFormat(payload.addressTown, addressTownFormat)) {
                this.errors.stack.addressTown = this.errorManifest.validation.invalidAddressTown;
            } else if (!this.isValidLength(payload.addressTown, otherAddressDetailsLength)) {
                this.errors.stack.addressTown = this.errorManifest.validation.invalidAddressTownLength;
            }

            if (!this.isValidFormat(payload.addressCounty, addressCountyFormat)) {
                this.errors.stack.addressCounty = this.errorManifest.validation.invalidAddressCounty;
            } else if (!this.isValidLength(payload.addressCounty, otherAddressDetailsLength)) {
                this.errors.stack.addressCounty = this.errorManifest.validation.invalidAddressCountyLength;
            }

            if (!this.isValidFormat(payload.addressCountry, addressCountyFormat)) {
                this.errors.stack.addressCountry = this.errorManifest.validation.invalidAddressCountry;
            } else if (!this.isValidLength(payload.addressCountry, otherAddressDetailsLength)) {
                this.errors.stack.addressCountry = this.errorManifest.validation.invalidAddressCountryLength;
            }

            if (payload.addressPostcode === "") {
                this.errors.stack.addressPostcode = this.errorManifest.validation.noPostCode;
            } else if (!this.isValidFormat(payload.addressPostcode, addressUKPostcodeFormat)) {
                this.errors.stack.addressPostcode = this.errorManifest.validation.invalidAddressPostcode;
            }

            if (!Object.keys(this.errors.stack).length) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(this.errors);
            }

        } catch (error) {
            this.errors.stack = this.errorManifest.generic.serverError;
            return Promise.reject(this.errors);
        }
    }

    isValidFormat (addressDetails: string, format: RegExp): boolean {
        if (addressDetails.match(format)) {
            return true;
        } else {
            return false;
        }
    }

    isValidLength (addressDetails: string, length: number): boolean {
        if (addressDetails.length <= length) {
            return true;
        } else {
            return false;
        }
    }
};
