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

    public saveManualAddressUpdate (req: Request, acspDetails: AcspFullProfile, isSoleTrader: boolean): void {
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
        if (isSoleTrader) {
            acspDetails.registeredOfficeAddress = correspondenceAddress;
        } else {
            acspDetails.serviceAddress = correspondenceAddress;
        }
    }

    public getCorrespondenceManualAddressUpdate (address: Address | undefined) {
        if (!address) {
            return {};
        }
        return {
            addressPropertyDetails: address.premises,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            addressTown: address.locality,
            addressCounty: address.region,
            countryInput: address.country,
            addressPostcode: address.postalCode
        };
    }
}
