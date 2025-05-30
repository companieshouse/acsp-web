import { Session } from "@companieshouse/node-session-handler";
import {
    ACSP_DETAILS_UPDATED,
    ACSP_DETAILS_UPDATE_IN_PROGRESS,
    ACSP_PROFILE_TYPE_SOLE_TRADER,
    ACSP_UPDATE_CHANGE_DATE,
    ACSP_UPDATE_PREVIOUS_PAGE_URL,
    ADD_AML_BODY_UPDATE,
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
import { Address, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { AmlMembershipNumberService } from "./amlMembershipNumberService";
import { AcspFullProfile } from "../../model/AcspFullProfile";

export const updateWithTheEffectiveDateAmendment = (req: Request, dateOfChange: string): void => {
    const session: Session = req.session as any as Session;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const currentPage = session.getExtraData(ACSP_UPDATE_PREVIOUS_PAGE_URL);
    const updateBodyIndex: number | undefined = session.getExtraData(ADD_AML_BODY_UPDATE);
    const newAMLBody: AmlSupervisoryBody = session.getExtraData(NEW_AML_BODY)!;
    const AmlMembershipNumberServiceInstance = new AmlMembershipNumberService();

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

export const getDateOfChangeFromSession = (previousPage: string, session: Session): string | undefined => {
    const mapping = [
        { pageUrl: UPDATE_ACSP_WHAT_IS_YOUR_NAME, dateOfChange: ACSP_UPDATE_CHANGE_DATE.NAME },
        { pageUrl: UPDATE_WHAT_IS_THE_BUSINESS_NAME, dateOfChange: ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS },
        { pageUrl: UPDATE_WHERE_DO_YOU_LIVE, dateOfChange: ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE },
        { pageUrl: UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM, dateOfChange: ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS },
        { pageUrl: UPDATE_BUSINESS_ADDRESS_CONFIRM, dateOfChange: ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS }
    ];

    for (const { pageUrl, dateOfChange } of mapping) {
        if (previousPage.includes(pageUrl) && session.getExtraData(dateOfChange)) {
            return session.getExtraData(dateOfChange);
        }
    }
    return undefined;
};

export const setUpdateInProgressAndGetDateOfChange = (previousPage: string, acspUpdatedFullProfile: AcspFullProfile, session: Session): string | undefined => {
    if (previousPage.includes(UPDATE_ACSP_WHAT_IS_YOUR_NAME)) {
        const updateInProgressSoleTraderName: soleTraderNameDetails = {
            forename: acspUpdatedFullProfile.soleTraderDetails?.forename,
            otherForenames: acspUpdatedFullProfile.soleTraderDetails?.otherForenames,
            surname: acspUpdatedFullProfile.soleTraderDetails?.surname
        };
        session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, updateInProgressSoleTraderName);
        return session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME);
    } else if (previousPage.includes(UPDATE_WHAT_IS_THE_BUSINESS_NAME)) {
        session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, acspUpdatedFullProfile.name);
        return session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS);
    } else if (previousPage.includes(UPDATE_WHERE_DO_YOU_LIVE)) {
        session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, acspUpdatedFullProfile.soleTraderDetails?.usualResidentialCountry);
        return session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE);
    } else if (previousPage.includes(UPDATE_CORRESPONDENCE_ADDRESS_CONFIRM)) {
        let updateInProgressCorrespondenceAddress: Address;
        if (acspUpdatedFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER) {
            updateInProgressCorrespondenceAddress = {
                premises: acspUpdatedFullProfile.registeredOfficeAddress.premises,
                addressLine1: acspUpdatedFullProfile.registeredOfficeAddress.addressLine1,
                addressLine2: acspUpdatedFullProfile.registeredOfficeAddress.addressLine2,
                locality: acspUpdatedFullProfile.registeredOfficeAddress.locality,
                region: acspUpdatedFullProfile.registeredOfficeAddress.region,
                country: acspUpdatedFullProfile.registeredOfficeAddress.country,
                postalCode: acspUpdatedFullProfile.registeredOfficeAddress.postalCode
            };
        } else {
            updateInProgressCorrespondenceAddress = {
                premises: acspUpdatedFullProfile.serviceAddress?.premises,
                addressLine1: acspUpdatedFullProfile.serviceAddress?.addressLine1,
                addressLine2: acspUpdatedFullProfile.serviceAddress?.addressLine2,
                locality: acspUpdatedFullProfile.serviceAddress?.locality,
                region: acspUpdatedFullProfile.serviceAddress?.region,
                country: acspUpdatedFullProfile.serviceAddress?.country,
                postalCode: acspUpdatedFullProfile.serviceAddress?.postalCode
            };
        };
        session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, updateInProgressCorrespondenceAddress);
        return session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS);
    } else if (previousPage.includes(UPDATE_BUSINESS_ADDRESS_CONFIRM)) {
        const updateInProgressBusinessAddress: Address = {
            premises: acspUpdatedFullProfile.registeredOfficeAddress.premises,
            addressLine1: acspUpdatedFullProfile.registeredOfficeAddress.addressLine1,
            addressLine2: acspUpdatedFullProfile.registeredOfficeAddress.addressLine2,
            locality: acspUpdatedFullProfile.registeredOfficeAddress.locality,
            region: acspUpdatedFullProfile.registeredOfficeAddress.region,
            country: acspUpdatedFullProfile.registeredOfficeAddress.country,
            postalCode: acspUpdatedFullProfile.registeredOfficeAddress.postalCode
        };
        session.setExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS, updateInProgressBusinessAddress);
        return session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS);
    }
    return undefined;
};
