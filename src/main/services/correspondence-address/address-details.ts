import { Request } from "express";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { ACSPData } from "../../model/ACSPData";
import { CORRESPONDENCE_ADDRESS } from "../../common/__utils/constants";

export class CorrespondenceAddressDetailsService {
    static saveCorrespondenceDetailsAddress (req: Request, acspData: ACSPData, selectPremise: string): void {
        const addressList = acspData.addresses!;
        for (const ukAddress of addressList) {
            if (ukAddress.propertyDetails!.toUpperCase() === selectPremise.toUpperCase()) {
                const correspondenceAddress = {
                    propertyDetails: ukAddress.propertyDetails,
                    line1: ukAddress.line1,
                    line2: ukAddress.line2,
                    town: ukAddress.town,
                    country: ukAddress.country,
                    postcode: ukAddress.postcode
                };
                saveDataInSession(req, CORRESPONDENCE_ADDRESS, correspondenceAddress);
                break;
            }
        }
    }
}
