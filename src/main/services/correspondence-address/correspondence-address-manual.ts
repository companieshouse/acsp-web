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

    public getCorrespondenceManualAddress (acspData: AcspData): Address {
        const payload: Address = {
            propertyDetails: acspData?.correspondenceAddress?.propertyDetails,
            line1: acspData?.correspondenceAddress?.line1,
            line2: acspData?.correspondenceAddress?.line2,
            town: acspData?.correspondenceAddress?.town,
            county: acspData?.correspondenceAddress?.county,
            country: acspData?.correspondenceAddress?.country,
            postcode: acspData?.correspondenceAddress?.postcode
        };
        return payload;
    }
}
