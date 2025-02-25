import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { REQ_TYPE_UPDATE_ACSP } from "../../common/__utils/constants";

export class BusinessAddressService {

    public saveBusinessAddress (req: Request, acspData: AcspData | AcspFullProfile): void {
        // Extract business address details from request body
        const businessAddress: Address = {
            premises: req.body.addressPropertyDetails,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            locality: req.body.addressTown,
            region: req.body.addressCounty,
            country: req.body.addressCountry,
            postalCode: req.body.addressPostcode
        };
        acspData.registeredOfficeAddress = businessAddress;
    }

    public getBusinessManualAddress (acspData: AcspData | AcspFullProfile, reqType?: string) {
        let country;
        if (reqType === REQ_TYPE_UPDATE_ACSP) {
            country = formatCountry(acspData?.registeredOfficeAddress?.country!);
        } else {
            country = acspData?.registeredOfficeAddress?.country;
        }
        return {
            addressPropertyDetails: acspData?.registeredOfficeAddress?.premises,
            addressLine1: acspData?.registeredOfficeAddress?.addressLine1,
            addressLine2: acspData?.registeredOfficeAddress?.addressLine2,
            addressTown: acspData?.registeredOfficeAddress?.locality,
            addressCounty: acspData?.registeredOfficeAddress?.region,
            addressCountry: country,
            addressPostcode: acspData?.registeredOfficeAddress?.postalCode
        };
    }
}

// convert string to lowercase and capitalizing the first letter of each word
const formatCountry = (country: string) => {
    return country
        .split(" ")
        .map((word, index) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize every word
        })
        .join(" ");
};
