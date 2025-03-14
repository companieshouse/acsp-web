import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export class BusinessAddressService {

    public saveBusinessAddress (req: Request, acspData: AcspData): void {
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

    public saveBusinessAddressUpdate (req: Request, acspFullProfile: AcspFullProfile, acspUpdatedFullProfile: AcspFullProfile): void {
        const originalCountry = acspFullProfile.registeredOfficeAddress.country;
        // Extract business address details from request body
        const businessAddress: Address = {
            premises: req.body.addressPropertyDetails,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            locality: req.body.addressTown,
            region: req.body.addressCounty,
            country: req.body.addressCountry.toUpperCase() === originalCountry?.toUpperCase() ? originalCountry : req.body.addressCountry,
            postalCode: req.body.addressPostcode
        };
        acspUpdatedFullProfile.registeredOfficeAddress = businessAddress;
    }

    public getBusinessManualAddress (acspData: AcspData | AcspFullProfile) {
        return {
            addressPropertyDetails: acspData?.registeredOfficeAddress?.premises,
            addressLine1: acspData?.registeredOfficeAddress?.addressLine1,
            addressLine2: acspData?.registeredOfficeAddress?.addressLine2,
            addressTown: acspData?.registeredOfficeAddress?.locality,
            addressCounty: acspData?.registeredOfficeAddress?.region,
            addressCountry: this.formatCountry(acspData?.registeredOfficeAddress?.country),
            addressPostcode: acspData?.registeredOfficeAddress?.postalCode
        };
    }

    // convert string to lowercase and capitalizing the first letter of each word
    private formatCountry = (country: string | undefined) => {
        if (country) {
            return country
                .split(" ")
                .map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize every word
                })
                .join(" ");
        } else {
            return country;
        }
    };
}
