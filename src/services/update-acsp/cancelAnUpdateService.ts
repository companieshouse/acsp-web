import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, ACSP_UPDATE_CHANGE_DATE } from "../../common/__utils/constants";
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
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS);
        break;
    case "usualResidentialCountry":
        acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry = acspFullProfile.soleTraderDetails!.usualResidentialCountry;
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE);
        break;
    case "serviceAddress":
        acspUpdatedFullProfile.serviceAddress = acspFullProfile.serviceAddress;
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS);
        break;
    case "registeredOfficeAddress":
        acspUpdatedFullProfile.registeredOfficeAddress = acspFullProfile.registeredOfficeAddress;
        if (acspUpdatedFullProfile.type === "sole-trader") {
            session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS);
        } else {
            session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS);
        }
        break;
    case "email":
        acspUpdatedFullProfile.email = acspFullProfile.email;
        break;
    case "personName":
        acspUpdatedFullProfile.soleTraderDetails!.forename = acspFullProfile.soleTraderDetails!.forename;
        acspUpdatedFullProfile.soleTraderDetails!.otherForenames = acspFullProfile.soleTraderDetails!.otherForenames;
        acspUpdatedFullProfile.soleTraderDetails!.surname = acspFullProfile.soleTraderDetails!.surname;
        session.deleteExtraData(ACSP_UPDATE_CHANGE_DATE.NAME);
        break;
    default:
        break;
    }
    session.setExtraData(ACSP_DETAILS_UPDATED, acspUpdatedFullProfile);
};
