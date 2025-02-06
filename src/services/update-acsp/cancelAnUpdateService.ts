import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Request } from "express";

export const cancelAnUpdate = (req: Request): void => {
    const session: Session = req.session as any as Session;
    const updateToCancel = req.query.cancel;
    const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;

    switch (updateToCancel) {
    case "businessName":
        acspUpdatedFullProfile.name = acspFullProfile.name;
        break;
    case "usualResidentialCountry":
        acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry = acspFullProfile.soleTraderDetails!.usualResidentialCountry;
        break;
    case "serviceAddress":
        acspUpdatedFullProfile.serviceAddress = acspFullProfile.serviceAddress;
        break;
    case "registeredOfficeAddress":
        acspUpdatedFullProfile.registeredOfficeAddress = acspFullProfile.registeredOfficeAddress;
        break;
    case "email":
        acspUpdatedFullProfile.email = acspFullProfile.email;
        break;
    case "personName":
        acspUpdatedFullProfile.soleTraderDetails!.forename = acspFullProfile.soleTraderDetails!.forename;
        acspUpdatedFullProfile.soleTraderDetails!.otherForenames = acspFullProfile.soleTraderDetails!.otherForenames;
        acspUpdatedFullProfile.soleTraderDetails!.surname = acspFullProfile.soleTraderDetails!.surname;
        break;
    default:
        break;
    }
    session.setExtraData(ACSP_DETAILS_UPDATED, acspUpdatedFullProfile);
};
