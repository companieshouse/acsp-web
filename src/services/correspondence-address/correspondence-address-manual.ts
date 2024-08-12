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
        const applicantDetails = acspData.applicantDetails!;
        applicantDetails.correspondenceAddress = correspondenceAddress;
        acspData.applicantDetails = applicantDetails;
    }

    public getCorrespondenceManualAddress (acspData: AcspData) {
        return {
            propertyDetails:
            acspData?.applicantDetails?.correspondenceAddress?.propertyDetails,
            addressLine1: acspData?.applicantDetails?.correspondenceAddress?.line1,
            addressLine2: acspData?.applicantDetails?.correspondenceAddress?.line2,
            addressTown: acspData?.applicantDetails?.correspondenceAddress?.town,
            addressCounty: acspData?.applicantDetails?.correspondenceAddress?.county,
            addressCountry:
              acspData?.applicantDetails?.correspondenceAddress?.country,
            addressPostcode:
              acspData?.applicantDetails?.correspondenceAddress?.postcode
        };
    }
}
