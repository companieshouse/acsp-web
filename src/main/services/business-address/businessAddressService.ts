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
        acspData.businessAddress = businessAddress;
    }

    public getBusinessManualAddress (acspData: AcspData) {
        return {
            propertyDetails: acspData?.businessAddress?.propertyDetails,
            addressLine1: acspData?.businessAddress?.line1,
            addressLine2: acspData?.businessAddress?.line2,
            addressTown: acspData?.businessAddress?.town,
            addressCounty: acspData?.businessAddress?.county,
            addressCountry: acspData?.businessAddress?.country,
            addressPostcode: acspData?.businessAddress?.postcode
        };
    }

}
