import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class BusinessAddressService {

    public saveBusinessAddress (req: Request, acspData: any): void {

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

    public getBusinessManualAddress (acspData: any) {
        return {
            addressPropertyDetails: acspData?.registeredOfficeAddress?.premises,
            addressLine1: acspData?.registeredOfficeAddress?.addressLine1,
            addressLine2: acspData?.registeredOfficeAddress?.addressLine2,
            addressTown: acspData?.registeredOfficeAddress?.locality,
            addressCounty: acspData?.registeredOfficeAddress?.region,
            addressCountry: acspData?.registeredOfficeAddress?.country,
            addressPostcode: acspData?.registeredOfficeAddress?.postalCode
        };
    }

}
