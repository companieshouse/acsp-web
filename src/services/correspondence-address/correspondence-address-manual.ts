import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export class CorrespondenceAddressManualService {
    public saveCorrespondenceManualAddress (req: Request, acspData: AcspData): void {
        // Extract correspondence address details from request body
        const correspondenceAddress: Address = {
            premises: req.body.addressPropertyDetails,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            locality: req.body.addressTown,
            region: req.body.addressCounty,
            country: req.body.countryInput,
            postalCode: req.body.addressPostcode
        };
        const applicantDetails = acspData.applicantDetails || {};
        applicantDetails.correspondenceAddress = correspondenceAddress;
        acspData.applicantDetails = applicantDetails;
    }

    public getCorrespondenceManualAddress (acspData: AcspData) {
        return {
            addressPropertyDetails: acspData?.applicantDetails?.correspondenceAddress?.premises,
            addressLine1: acspData?.applicantDetails?.correspondenceAddress?.addressLine1,
            addressLine2: acspData?.applicantDetails?.correspondenceAddress?.addressLine2,
            addressTown: acspData?.applicantDetails?.correspondenceAddress?.locality,
            addressCounty: acspData?.applicantDetails?.correspondenceAddress?.region,
            countryInput:
              acspData?.applicantDetails?.correspondenceAddress?.country,
            addressPostcode:
              acspData?.applicantDetails?.correspondenceAddress?.postalCode
        };
    }

    public saveCorrespondenceManualAddressUpdate (req: Request, acspDetails: AcspFullProfile): void {
        // Extract correspondence address details from request body
        const correspondenceAddress: Address = {
            premises: req.body.addressPropertyDetails,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            locality: req.body.addressTown,
            region: req.body.addressCounty,
            country: req.body.countryInput,
            postalCode: req.body.addressPostcode
        };
        acspDetails.serviceAddress = correspondenceAddress;
    }

    public getCorrespondenceManualAddressUpdate (acspDetails: AcspFullProfile) {
        return {
            addressPropertyDetails: acspDetails.serviceAddress?.premises,
            addressLine1: acspDetails.serviceAddress?.addressLine1,
            addressLine2: acspDetails.serviceAddress?.addressLine2,
            addressTown: acspDetails.serviceAddress?.locality,
            addressCounty: acspDetails.serviceAddress?.region,
            countryInput: acspDetails.serviceAddress?.country,
            addressPostcode: acspDetails.serviceAddress?.postalCode
        };
    }
}
