import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { ADDRESS_LIST, USER_DATA } from "../../common/__utils/constants";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { ACSPData } from "../../model/ACSPData";
import { Address } from "../../model/Address";
import { getCountryFromKey } from "../../utils/web";

export class AddressLookUpService {

    public async saveBusinessAddressToSession (req: Request, ukAddresses: UKAddress[], inputPremise: string): Promise<void> {

        const address: Address = this.getAddress(ukAddresses, inputPremise);
        // Save the address to session
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };

        acspData.businessAddress = address;
        saveDataInSession(req, USER_DATA, acspData);
    }

    public async saveCorrespondenceAddressToSession (req: Request, ukAddresses: UKAddress[], inputPremise: string): Promise<void> {

        const address: Address = this.getAddress(ukAddresses, inputPremise);
        // Save the address to session
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };

        acspData.address = address;
        saveDataInSession(req, USER_DATA, acspData);
    }

    private getAddress (ukAddresses: UKAddress[], inputPremise: string) {
        let address: Address = {
            propertyDetails: "",
            line1: "",
            line2: "",
            town: "",
            country: "",
            postcode: ""
        };
        for (const ukAddress of ukAddresses) {
            if (ukAddress.premise === inputPremise) {
                address = {
                    propertyDetails: ukAddress.premise,
                    line1: ukAddress.addressLine1,
                    line2: ukAddress.addressLine2!,
                    town: ukAddress.postTown,
                    country: getCountryFromKey(ukAddress.country),
                    postcode: ukAddress.postcode
                };
            }
        }
        return address;
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

    public saveBusinessAddressFromList (req: Request, businessAddress: Address): void {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };

        acspData.businessAddress = businessAddress;
        saveDataInSession(req, USER_DATA, acspData);
    }

    public saveCorrespondenceAddressFromList (req: Request, correspondenceAddress: Address): void {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session.getExtraData(USER_DATA) ? session.getExtraData(USER_DATA)! : { id: "" };
        acspData.address = correspondenceAddress;
        saveDataInSession(req, USER_DATA, acspData);
    }
}
