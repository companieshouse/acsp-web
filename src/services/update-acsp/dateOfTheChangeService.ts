import { Session } from "@companieshouse/node-session-handler";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_ELEMENT,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_PROFILE_TYPE_SOLE_TRADER,
    ACSP_UPDATE_CHANGE_DATE
} from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Request } from "express";
import {
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_BUSINESS_ADDRESS_LOOKUP,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME,
    UPDATE_WHAT_IS_YOUR_EMAIL,
    UPDATE_WHERE_DO_YOU_LIVE,
    UPDATE_YOUR_ANSWERS
} from "../../types/pageURL";

export const updateWithTheEffectiveDateAmendment = (req: Request, dateOfChange: Date): void => {
    const session: Session = req.session as any as Session;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const currentPage = session.getExtraData(ACSP_DETAILS_UPDATE_ELEMENT);

    if (currentPage === UPDATE_WHAT_IS_THE_BUSINESS_NAME) {
        acspUpdatedFullProfile.name = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS, dateOfChange);
    } else if (currentPage === UPDATE_ACSP_WHAT_IS_YOUR_NAME) {
        const soleTraderDetails: AcspFullProfile["soleTraderDetails"] = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        acspUpdatedFullProfile.soleTraderDetails!.forename = soleTraderDetails.forename;
        acspUpdatedFullProfile.soleTraderDetails!.otherForenames = soleTraderDetails.otherForenames;
        acspUpdatedFullProfile.soleTraderDetails!.surname = soleTraderDetails.surname;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
    } else if (currentPage === UPDATE_WHERE_DO_YOU_LIVE) {
        acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE, dateOfChange);
    } else if (currentPage === UPDATE_BUSINESS_ADDRESS_CONFIRM) {
        acspUpdatedFullProfile.registeredOfficeAddress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS, dateOfChange);
    } else if (currentPage === UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM) {
        if (acspUpdatedFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER) {
            acspUpdatedFullProfile.registeredOfficeAddress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        } else {
            acspUpdatedFullProfile.serviceAddress = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        }
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS, dateOfChange);
    }
    session.deleteExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
};

export const determinePreviousPageUrl = (url: string): string => {
    let previousPageUrl = UPDATE_YOUR_ANSWERS;
    if (url?.includes(UPDATE_ACSP_WHAT_IS_YOUR_NAME)) {
        previousPageUrl = UPDATE_ACSP_WHAT_IS_YOUR_NAME;
    } else if (url?.includes(UPDATE_WHERE_DO_YOU_LIVE)) {
        previousPageUrl = UPDATE_WHERE_DO_YOU_LIVE;
    } else if (url?.includes(UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM)) {
        previousPageUrl = UPDATE_CORRESPONDENCE_ADDRESS_LOOKUP;
    } else if (url?.includes(UPDATE_BUSINESS_ADDRESS_CONFIRM)) {
        previousPageUrl = UPDATE_BUSINESS_ADDRESS_LOOKUP;
    } else if (url?.includes(UPDATE_WHAT_IS_YOUR_EMAIL)) {
        previousPageUrl = UPDATE_WHAT_IS_YOUR_EMAIL;
    } else if (url?.includes(UPDATE_WHAT_IS_THE_BUSINESS_NAME)) {
        previousPageUrl = UPDATE_WHAT_IS_THE_BUSINESS_NAME;
    }
    return previousPageUrl;
};
