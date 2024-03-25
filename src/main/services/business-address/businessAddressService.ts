import { Request } from "express";
import { saveDataInSession } from "../../common/__utils/sessionHelper";
import { BUSINESS_ADDRESS, BUSINESS_NAME } from "../../common/__utils/constants";
import { Company } from "../../model/Company";
import { Address } from "../../model/Address";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { Session } from "@companieshouse/node-session-handler";

export class BusinessAddressService {
    private readonly sessionKey = "businessAddress";

    public saveToSession (req: Request): void {
        const session: Session = req.session as any as Session;
        const businessAddress : Address = {
            propertyDetails: req.body.addressPropertyDetails,
            line1: req.body.addressLine1,
            line2: req.body.addressLine2,
            town: req.body.addressTown,
            county: req.body.addressCounty,
            country: req.body.addressCountry,
            postcode: req.body.addressPostcode
        };
        saveDataInSession(req, BUSINESS_ADDRESS, businessAddress);
    }
}
