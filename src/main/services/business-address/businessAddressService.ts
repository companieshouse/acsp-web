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

    public getBusinessManualAddress (acspData: AcspData): Address {
        return {
            propertyDetails: acspData?.businessAddress?.propertyDetails,
            line1: acspData?.businessAddress?.line1,
            line2: acspData?.businessAddress?.line2,
            town: acspData?.businessAddress?.town,
            county: acspData?.businessAddress?.county,
            country: acspData?.businessAddress?.country,
            postcode: acspData?.businessAddress?.postcode
        };
    }

}
