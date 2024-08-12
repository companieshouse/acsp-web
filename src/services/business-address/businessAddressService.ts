import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

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
        acspData.businessAddress = businessAddress;
    }

    public getBusinessManualAddress (acspData: AcspData) {
        return {
            addressPropertyDetails: acspData?.businessAddress?.premises,
            addressLine1: acspData?.businessAddress?.addressLine1,
            addressLine2: acspData?.businessAddress?.addressLine2,
            addressTown: acspData?.businessAddress?.locality,
            addressCounty: acspData?.businessAddress?.region,
            addressCountry: acspData?.businessAddress?.country,
            addressPostcode: acspData?.businessAddress?.postalCode
        };
    }

}
