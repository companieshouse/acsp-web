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
    const acspinProgressFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const currentPage = session.getExtraData(ACSP_DETAILS_UPDATE_ELEMENT);

    if (currentPage === UPDATE_WHAT_IS_THE_BUSINESS_NAME) {
        acspUpdatedFullProfile.name = acspinProgressFullProfile.name;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS, dateOfChange);
    } else if (currentPage === UPDATE_ACSP_WHAT_IS_YOUR_NAME) {
        acspUpdatedFullProfile.soleTraderDetails!.forename = acspinProgressFullProfile.soleTraderDetails!.forename;
        acspUpdatedFullProfile.soleTraderDetails!.otherForenames = acspinProgressFullProfile.soleTraderDetails!.otherForenames;
        acspUpdatedFullProfile.soleTraderDetails!.surname = acspinProgressFullProfile.soleTraderDetails!.surname;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME, dateOfChange);
    } else if (currentPage === UPDATE_WHERE_DO_YOU_LIVE) {
        acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry = acspinProgressFullProfile.soleTraderDetails!.usualResidentialCountry;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE, dateOfChange);
    } else if (currentPage === UPDATE_BUSINESS_ADDRESS_CONFIRM) {
        acspUpdatedFullProfile.registeredOfficeAddress = acspinProgressFullProfile.registeredOfficeAddress;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS, dateOfChange);
    } else if (currentPage === UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM) {
        acspinProgressFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER
            ? acspUpdatedFullProfile.registeredOfficeAddress = acspinProgressFullProfile.registeredOfficeAddress
            : acspUpdatedFullProfile.serviceAddress = acspinProgressFullProfile.serviceAddress;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS, dateOfChange);
        acspUpdatedFullProfile.registeredOfficeAddress = acspinProgressFullProfile.registeredOfficeAddress;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS, dateOfChange);
    }
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
