import { UKAddress } from "@companieshouse/api-sdk-node/dist/services/postcode-lookup/types";
import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { ADDRESS_LIST, USER_DATA } from "../../common/__utils/constants";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { ACSPData } from "../../model/ACSPData";
import { Address } from "../../model/Address";
import { getCountryFromKey } from "../../utils/web";

export class CorrespondenceAddressAutoLookService {
    saveCorrespondenceAddress (acspData :ACSPData, ukAddresses: UKAddress[], inputPremise: string): ACSPData {

        const address = {
            premise: "",
            propertyDetails: "",
            line1: "",
            line2: "",
            town: "",
            country: "",
            postcode: ""
        };
        for (const ukAddress of ukAddresses) {
            if (ukAddress.premise === inputPremise) {
                const correspondenceAddress: Address = {
                    propertyDetails: ukAddress.premise,
                    // premise: ukAddress.premise,
                    line1: ukAddress.addressLine1,
                    line2: ukAddress.addressLine2!,
                    town: ukAddress.postTown,
                    country: getCountryFromKey(ukAddress.country),
                    postcode: ukAddress.postcode
                };

                acspData.addresses = [correspondenceAddress];
                break;
            }
        }
        return acspData;
    }

    saveAddressListToSession (acspData: ACSPData, ukAddresses: UKAddress[]): ACSPData {

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
        // Save the list of addresses to the session
        acspData.addresses = addressList;
        return acspData;
    }
}

export default CorrespondenceAddressAutoLookService;
