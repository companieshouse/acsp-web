import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class CorrespondenceAddressManualService {
    public saveCorrespondenceManualAddress (req: Request, acspData: AcspData): void {
        // Extract correspondence address details from request body
        const correspondenceAddress: Address = {
            propertyDetails: req.body.addressPropertyDetails,
            line1: req.body.addressLine1,
            line2: req.body.addressLine2,
            town: req.body.addressTown,
            county: req.body.addressCounty,
            country: req.body.addressCountry,
            postcode: req.body.addressPostcode
        };

        acspData.correspondenceAddress = correspondenceAddress;
    }

    public getCorrespondenceManualAddress (acspData: AcspData) {
        return {
            propertyDetails: acspData?.correspondenceAddress?.propertyDetails,
            addressLine1: acspData?.correspondenceAddress?.line1,
            addressLine2: acspData?.correspondenceAddress?.line2,
            addressTown: acspData?.correspondenceAddress?.town,
            addressCounty: acspData?.correspondenceAddress?.county,
            addressCountry: acspData?.correspondenceAddress?.country,
            addressPostcode: acspData?.correspondenceAddress?.postcode
        };
    }
}
