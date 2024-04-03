import { Request } from "express";
import { Address } from "../../model/Address";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { Session } from "@companieshouse/node-session-handler";
import { USER_DATA } from "../../common/__utils/constants";
import { ACSPData } from "main/model/ACSPData";

export class CorrespondenceAddressManualService {
    public saveCorrespondenceManualAddress (req: Request): void {
        const session: Session = req.session as any as Session;

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

        const acspData: ACSPData = session.getExtraData(USER_DATA) || { id: "" };

        acspData.address = correspondenceAddress;

        saveDataInSession(req, USER_DATA, acspData);
    }
}