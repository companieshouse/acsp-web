import { Request } from "express";
import { Address } from "../../model/Address";
import { ACSPData } from "../../model/ACSPData";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { USER_DATA } from "../../common/__utils/constants";

export class CorrespondenceAddressManualService {
    saveCorrespondenceManualAddress(req: Request, acspData: ACSPData): void {
        const correspondenceAddress: Address = {
            propertyDetails: req.body.addressPropertyDetails,
            line1: req.body.addressLine1,
            line2: req.body.addressLine2,
            town: req.body.addressTown,
            county: req.body.addressCounty,
            country: req.body.addressCountry,
            postcode: req.body.addressPostcode
        };

        const userAddress: Array<Address> = acspData?.addresses ? acspData.addresses : [];
        userAddress.push(correspondenceAddress);
        acspData.addresses = userAddress;
        saveDataInSession(req, USER_DATA, acspData);
    }
}
