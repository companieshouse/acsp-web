import { Session } from "@companieshouse/node-session-handler";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_ELEMENT,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_PROFILE_TYPE_SOLE_TRADER,
    ACSP_UPDATE_CHANGE_DATE,
    ACSP_UPDATE_PREVIOUS_PAGE_URL
} from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Request } from "express";
import {
    UPDATE_ACSP_DETAILS_BASE_URL,
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME,
    UPDATE_WHERE_DO_YOU_LIVE
} from "../../types/pageURL";
import { soleTraderNameDetails } from "../../model/SoleTraderNameDetails";
import { getPreviousPageUrl } from "../../services/url";

export const updateWithTheEffectiveDateAmendment = (req: Request, dateOfChange: string): void => {
    const session: Session = req.session as any as Session;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const currentPage = session.getExtraData(ACSP_DETAILS_UPDATE_ELEMENT);

    if (currentPage === UPDATE_WHAT_IS_THE_BUSINESS_NAME) {
        acspUpdatedFullProfile.name = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS, dateOfChange);
    } else if (currentPage === UPDATE_ACSP_WHAT_IS_YOUR_NAME) {
        const soleTraderDetails: soleTraderNameDetails = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
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
    session.deleteExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL);
};

export const getPreviousPageUrlDateOfChange = (req: Request): string => {
    const session: Session = req.session as any as Session;
    const previousPageUrl: string = session.getExtraData(ACSP_DETAILS_UPDATE_ELEMENT) || "";
    /* if (!previousPageUrl) {
        previousPageUrl = getPreviousPageUrl(req, UPDATE_ACSP_DETAILS_BASE_URL) || UPDATE_ACSP_DETAILS_BASE_URL;
        session.setExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL, previousPageUrl);
    } */
    console.log("QWERTYUIOPASDFGHJKLZXCVBNMQWERTYUIOPASDFGHJKLZXCVBNMQWERTYUIOPASDFGHJKLZXCVBNMNGVHGGJGVG " + previousPageUrl);
    return previousPageUrl || UPDATE_ACSP_DETAILS_BASE_URL;
};
