import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { ADDRESS_LIST, USER_DATA } from "../../common/__utils/constants";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { getCountryFromKey } from "../../utils/web";
import { getAddressFromPostcode } from "../../services/postcode-lookup-service";
import { addLangToUrl, selectLang } from "../../utils/localise";
import { BASE_URL } from "../../types/pageURL";

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
        acspData.correspondenceAddress = correspondenceAddress;
    }

    public getAddressFromPostcode (req: Request, postcode: string, inputPremise: string, acspData: AcspData, businessAddress: boolean, ...nexPageUrls: string[]) : Promise<string> {
        const lang = selectLang(req.query.lang);
        return getAddressFromPostcode(postcode).then((ukAddresses) => {
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
                        postcode: req.body.postCode
                    };
                    acspData.registeredOfficeAddress = address;
                } else {
                    // update ascpData with postcode to save to DB
                    const correspondenceAddress: Address = {
                        postcode: req.body.postCode
                    };
                    acspData.correspondenceAddress = correspondenceAddress;
                }
                return addLangToUrl(BASE_URL + nexPageUrls[1], lang);
            }

        }).catch((err) => {
            throw err;
        });
    }

    public saveAddressListToSession (req: Request, ukAddresses: UKAddress[]): void {

        const addressList : Array<Address> = [];
        for (const ukAddress of ukAddresses) {
            const address = {
                propertyDetails: ukAddress.premise,
                line1: ukAddress.addressLine1,
                line2: ukAddress.addressLine2,
                town: ukAddress.postTown,
                country: getCountryFromKey(ukAddress.country),
                postcode: ukAddress.postcode,
                formattedAddress: ukAddress.premise + ", " + ukAddress.addressLine1 + ", " + ukAddress.postTown + ", " + getCountryFromKey(ukAddress.country) + ", " + ukAddress.postcode
            };

            addressList.push(address);

        }
        // Save the list of addresses to the session
        saveDataInSession(req, ADDRESS_LIST, addressList);
    }

    public async saveCorrespondenceAddress (ukAddresses: UKAddress[], inputPremise: string, acspData: AcspData): Promise<void> {
        // save correspondence addess to model to be saved in mongoDB
        acspData.correspondenceAddress = this.getAddress(ukAddresses, inputPremise);
    }

    public async saveBusinessAddress (ukAddresses: UKAddress[], inputPremise: string, acspData: AcspData): Promise<void> {
        // save business addess to model to be saved in mongoDB
        acspData.registeredOfficeAddress = this.getAddress(ukAddresses, inputPremise);
    }

    private getAddress (ukAddresses: UKAddress[], inputPremise: string) {
        const address = ukAddresses.find((address) => address.premise === inputPremise);
        return {
            propertyDetails: address?.premise,
            line1: address?.addressLine1,
            line2: address?.addressLine2,
            town: address?.postTown,
            country: getCountryFromKey(address?.country!),
            postcode: address?.postcode
        };
    }
}
