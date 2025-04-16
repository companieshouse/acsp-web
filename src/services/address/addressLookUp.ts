import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { ValidationError, validationResult } from "express-validator";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { ADDRESS_LIST, USER_DATA } from "../../common/__utils/constants";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getCountryFromKey } from "../../services/common";
import { getAddressFromPostcode } from "../../services/postcode-lookup-service";
import { addLangToUrl, selectLang } from "../../utils/localise";
import { BASE_URL, UPDATE_ACSP_DETAILS_BASE_URL } from "../../types/pageURL";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export class AddressLookUpService {

    public async saveBusinessAddressToSession (req: Request, ukAddresses: UKAddress[], inputPremise: string): Promise<void> {

        const address: Address = this.getAddress(ukAddresses, inputPremise);
        // Save the address to session
        const session: Session = req.session as any as Session;
        const acspData: AcspData = session.getExtraData(USER_DATA)!;

        acspData.registeredOfficeAddress = address;
        saveDataInSession(req, USER_DATA, acspData);
    }

    public saveBusinessAddressFromList (businessAddress: Address, acspData: AcspData): void {
        acspData.registeredOfficeAddress = businessAddress;
    }

    public saveCorrespondenceAddressFromList (req: Request, correspondenceAddress: Address, acspData: AcspData): void {
        const applicantDetails = acspData.applicantDetails || {};
        applicantDetails.correspondenceAddress = correspondenceAddress;
        acspData.applicantDetails = applicantDetails;
    }

    public getAddressFromPostcode (req: Request, postcode: string, inputPremise: string, acspData: AcspData, businessAddress: boolean, ...nexPageUrls: string[]) : Promise<string> {
        const lang = selectLang(req.query.lang);
        return getAddressFromPostcode(postcode).then((ukAddresses) => {
            if (ukAddresses.some(address => address.country === "")) {
                throw new Error("correspondenceLookUpAddressWithoutCountry");
            } else {
                if (inputPremise !== "" && ukAddresses.find((address) => address.premise === inputPremise)) {
                    if (businessAddress) {
                        this.saveBusinessAddress(ukAddresses, inputPremise, acspData);
                    } else {
                        this.saveCorrespondenceAddress(ukAddresses, inputPremise, acspData);
                    }

                    return addLangToUrl(BASE_URL + nexPageUrls[0], lang);
                } else {
                    this.saveAddressListToSession(req, ukAddresses);

                    if (businessAddress) {
                        // update ascpData with postcode to save to DB
                        const address: Address = {
                            postalCode: req.body.postCode
                        };
                        acspData.registeredOfficeAddress = address;
                    } else {
                        // update ascpData with postcode to save to DB
                        const correspondenceAddress: Address = {
                            postalCode: req.body.postCode
                        };
                        const applicantDetails = acspData.applicantDetails || {};
                        applicantDetails.correspondenceAddress = correspondenceAddress;
                        acspData.applicantDetails = applicantDetails;
                    }
                    return addLangToUrl(BASE_URL + nexPageUrls[1], lang);
                }
            }
        }).catch((err) => {
            throw err;
        });
    }

    public getErrorMessage (error:Error, postcode:any) :ValidationError {
        let validationError: ValidationError;
        if (error.message === "correspondenceLookUpAddressWithoutCountry") {
            validationError = {
                value: postcode,
                msg: "correspondenceLookUpAddressWithoutCountry",
                param: "postCode",
                location: "body"
            };
        } else {
            validationError = {
                value: postcode,
                msg: "correspondenceLookUpAddressInvalidAddressPostcode",
                param: "postCode",
                location: "body"
            };
        }
        return validationError;
    }

    public processAddressFromPostcodeUpdateJourney (req: Request, postcode: string, inputPremise: string, acspDetails: AcspFullProfile, businessAddress: boolean, ...nexPageUrls: string[]) : Promise<string> {
        const lang = selectLang(req.query.lang);
        return getAddressFromPostcode(postcode).then((ukAddresses) => {
            if (inputPremise !== "" && ukAddresses.find((address) => address.premise === inputPremise)) {
                if (businessAddress) {
                    this.saveBusinessAddressUpdateJourney(ukAddresses, inputPremise, acspDetails);
                } else {
                    this.saveCorrespondenceAddressUpdateJourney(ukAddresses, inputPremise, acspDetails);
                }

                return addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + nexPageUrls[0], lang);
            } else {
                this.saveAddressListToSession(req, ukAddresses);

                if (businessAddress) {
                    // update acspDetails with postcode to save to DB
                    const address: Address = {
                        postalCode: req.body.postCode
                    };
                    acspDetails.registeredOfficeAddress = address;
                } else {
                    // update acspDetails with postcode to save to DB
                    const correspondenceAddress: Address = {
                        postalCode: req.body.postCode
                    };
                    acspDetails.serviceAddress = correspondenceAddress;
                }
                return addLangToUrl(UPDATE_ACSP_DETAILS_BASE_URL + nexPageUrls[1], lang);
            }

        }).catch((err) => {
            throw err;
        });
    }

    public saveAddressListToSession (req: Request, ukAddresses: UKAddress[]): void {

        const addressList : Array<Address> = [];
        for (const ukAddress of ukAddresses) {
            const address = {
                premises: ukAddress.premise,
                addressLine1: ukAddress.addressLine1,
                addressLine2: ukAddress.addressLine2,
                locality: ukAddress.postTown,
                country: getCountryFromKey(ukAddress.country),
                postalCode: ukAddress.postcode,
                formattedAddress: ukAddress.premise + ", " + ukAddress.addressLine1 + ", " + ukAddress.postTown + ", " + getCountryFromKey(ukAddress.country) + ", " + ukAddress.postcode
            };

            addressList.push(address);

        }
        // Save the list of addresses to the session
        saveDataInSession(req, ADDRESS_LIST, addressList);
    }

    public async saveCorrespondenceAddress (ukAddresses: UKAddress[], inputPremise: string, acspData: AcspData): Promise<void> {
        // save correspondence addess to model to be saved in mongoDB
        const applicantDetails = acspData.applicantDetails || {};
        applicantDetails.correspondenceAddress = this.getAddress(ukAddresses, inputPremise);
        acspData.applicantDetails = applicantDetails;
    }

    public async saveBusinessAddress (ukAddresses: UKAddress[], inputPremise: string, acspData: AcspData): Promise<void> {
        // save business addess to model to be saved in mongoDB
        acspData.registeredOfficeAddress = this.getAddress(ukAddresses, inputPremise);
    }

    public async saveCorrespondenceAddressUpdateJourney (ukAddresses: UKAddress[], inputPremise: string, acspDetails: AcspFullProfile): Promise<void> {
        acspDetails.serviceAddress = this.getAddress(ukAddresses, inputPremise);
    }

    public async saveBusinessAddressUpdateJourney (ukAddresses: UKAddress[], inputPremise: string, acspDetails: AcspFullProfile): Promise<void> {
        acspDetails.registeredOfficeAddress = this.getAddress(ukAddresses, inputPremise);
    }

    private getAddress (ukAddresses: UKAddress[], inputPremise: string): Address {
        const address = ukAddresses.find((foundAddress) => foundAddress.premise === inputPremise);
        return {
            premises: address?.premise,
            addressLine1: address?.addressLine1,
            addressLine2: address?.addressLine2,
            locality: address?.postTown,
            country: getCountryFromKey(address?.country!),
            postalCode: address?.postcode
        };
    }
}
