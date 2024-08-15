import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class BusinessAddressService {

    public saveBusinessAddress (req: Request, acspData: AcspData): void {

        // Extract business address details from request body
        const businessAddress: Address = {
            propertyDetails: req.body.addressPropertyDetails,
            line1: req.body.addressLine1,
            line2: req.body.addressLine2,
            town: req.body.addressTown,
            county: req.body.addressCounty,
            country: req.body.addressCountry,
            postcode: req.body.addressPostcode
        };
        acspData.registeredOfficeAddress = businessAddress;
    }

    public getBusinessManualAddress (acspData: AcspData) {
        return {
            addressPropertyDetails: acspData?.registeredOfficeAddress?.propertyDetails,
            addressLine1: acspData?.registeredOfficeAddress?.line1,
            addressLine2: acspData?.registeredOfficeAddress?.line2,
            addressTown: acspData?.registeredOfficeAddress?.town,
            addressCounty: acspData?.registeredOfficeAddress?.county,
            addressCountry: acspData?.registeredOfficeAddress?.country,
            addressPostcode: acspData?.registeredOfficeAddress?.postcode
        };
    }

}
