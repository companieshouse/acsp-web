import { Request } from "express";
import { AcspData, Address } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS } from "../../common/__utils/constants";

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

    public saveManualAddressUpdate (req: Request): void {
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
        const session: Session = req.session as any as Session;
        session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, correspondenceAddress);
    }

    public getCorrespondenceManualAddress (address: Address | undefined) {
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
