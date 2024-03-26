import { Request } from "express";
import { Address } from "../../model/Address";
import { ACSPData } from "../../model/ACSPData";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../common/__utils/constants";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { getCountryFromKey } from "../../utils/web";
import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup";

class CorrespondenceAddressAutoLookService {
    static saveCorrespondenceAddressToSession (
        session: Session,
        req: Request,
        ukAddresses: UKAddress[],
        correspondencePremise: string
    ): void {
        const ACSPData: ACSPData = session?.getExtraData(USER_DATA)!;

        let address = {
            premise: "",
            addressLine1: "",
            addressLine2: "",
            postTown: "",
            postalCode: "",
            country: ""
        };
        for (const ukAddress of ukAddresses) {
            if (ukAddress.premise === correspondencePremise) {
                address = {
                    premise: ukAddress.premise,
                    addressLine1: ukAddress.addressLine1,
                    addressLine2: ukAddress.addressLine2!,
                    postTown: ukAddress.postTown,
                    postalCode: ukAddress.postcode,
                    country: getCountryFromKey(ukAddress.country)
                };
            }
        }

        const correspondenceAddress: Address = {
            propertyDetails: address.premise,
            line1: address.addressLine1,
            line2: address.addressLine2,
            town: address.postTown,
            country: address.country,
            postcode: address.postalCode
        };
        const userAddresses: Array<Address> = ACSPData?.addresses ? ACSPData.addresses : [];
        userAddresses.push(correspondenceAddress);
        ACSPData.addresses = userAddresses;
        saveDataInSession(req, USER_DATA, ACSPData);
    }

    static saveAddressListToSession (session: Session, req: Request, ukAddresses: UKAddress[]): void {
        const ACSPData: ACSPData = session?.getExtraData(USER_DATA)!;

        const addressList: Array<Address> = [];
        for (const ukAddress of ukAddresses) {
            const address = {
                propertyDetails: ukAddress.premise,
                line1: ukAddress.addressLine1,
                line2: ukAddress.addressLine2,
                town: ukAddress.postTown,
                country: getCountryFromKey(ukAddress.country),
                postcode: ukAddress.postcode,
                formattedAddress: `${ukAddress.premise}, ${ukAddress.addressLine1}, ${ukAddress.postTown}, ${getCountryFromKey(ukAddress.country)}, ${ukAddress.postcode}`
            };
            addressList.push(address);
        }

        ACSPData.addresses = addressList;
        saveDataInSession(req, USER_DATA, ACSPData);
    }
}

export default CorrespondenceAddressAutoLookService;
