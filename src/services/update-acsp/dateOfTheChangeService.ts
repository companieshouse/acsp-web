import { Session } from "@companieshouse/node-session-handler";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_PROFILE_TYPE_SOLE_TRADER,
    ACSP_UPDATE_CHANGE_DATE,
    ACSP_UPDATE_PREVIOUS_PAGE_URL,
    ADD_AML_BODY_UPDATE,
    DATE_OF_CHANGE_PAYLOAD,
    NEW_AML_BODY
} from "../../common/__utils/constants";
import { Request } from "express";
import {
    UPDATE_ACSP_WHAT_IS_YOUR_NAME,
    UPDATE_AML_MEMBERSHIP_NUMBER,
    UPDATE_BUSINESS_ADDRESS_CONFIRM,
    UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM,
    UPDATE_WHAT_IS_THE_BUSINESS_NAME,
    UPDATE_WHERE_DO_YOU_LIVE
} from "../../types/pageURL";
import { soleTraderNameDetails } from "../../model/SoleTraderNameDetails";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AmlMembershipNumberService } from "./amlMembershipNumberService";
import { AcspFullProfile } from "../../model/AcspFullProfile";

export const updateWithTheEffectiveDateAmendment = (req: Request, dateOfChange: string): void => {
    const session: Session = req.session as any as Session;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const currentPage = session.getExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL);
    const updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);
    const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY)!;
    const AmlMembershipNumberServiceInstance = new AmlMembershipNumberService();

    /*    session.setExtraData(DATE_OF_CHANGE_PAYLOAD, {
                "change-year": req.body["change-year"],
                "change-month": req.body["change-month"] - 1,
                "change-day": req.body["change-day"]
            }); */

    if (currentPage === UPDATE_WHAT_IS_THE_BUSINESS_NAME) {
        acspUpdatedFullProfile.name = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS)!;
        session.setExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS, dateOfChange);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA____________________ ", dateOfChange);
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
    } else if (currentPage === UPDATE_AML_MEMBERSHIP_NUMBER) {
        // Add the dateOfChange to the NEW_AML_BODY
        newAMLBody.dateOfChange = dateOfChange;
        session.setExtraData(NEW_AML_BODY, newAMLBody);

        // Validate and clean up session data
        AmlMembershipNumberServiceInstance.validateUpdateBodyIndex(updateBodyIndex, acspUpdatedFullProfile, newAMLBody);

        session.deleteExtraData(NEW_AML_BODY);
    }

    session.deleteExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
};

export const getPreviousPageUrlDateOfChange = (req: Request): string => {
    const session: Session = req.session as any as Session;
    return session.getExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL) || "";

};
