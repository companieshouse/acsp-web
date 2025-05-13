import { Session } from "@companieshouse/node-session-handler";
import { deepEquals, formatAddressIntoHTMLString, formatDateIntoReadableString, getFullNameACSPFullProfileDetails } from "../../services/common";
import { ACSP_UPDATE_CHANGE_DATE, AML_REMOVED_BODY_DETAILS } from "../../common/__utils/constants";
import { AcspFullProfile } from "../../model/AcspFullProfile";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

interface YourUpdates {
    name?: {value: string, changedDate: string};
    businessName?: {value: string, changedDate: string};
    correspondenceEmail?: {value: string};
    registeredOfficeAddress?: {value: string, changedDate: string};
    businessAddress?: {value: string, changedDate: string};
    serviceAddress?: {value: string, changedDate: string};
    usualResidentialCountry?: {value: string, changedDate: string};
}

interface YourAMLUpdates {
    membershipName: string;
    membershipNumber: string;
    changedDate: string;
}

export const getFormattedUpdates = (session: Session, acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile): YourUpdates => {
    let updates: YourUpdates = {};
    // Business Name Changes
    if (acspFullProfile.name !== updatedFullProfile.name) {
        updates.businessName = {
            value: updatedFullProfile.name,
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME_OF_BUSINESS)!))
        };
    }
    // Email Address Changes
    if (acspFullProfile.email !== updatedFullProfile.email) {
        updates.correspondenceEmail = {
            value: updatedFullProfile.email
        };
    }
    if (acspFullProfile.type === "limited-company" || acspFullProfile.type === "limited-liability-partnership" || acspFullProfile.type === "corporate-body") {
        updates = limtedChanges(session, acspFullProfile, updatedFullProfile, updates);
    } else if (acspFullProfile.type === "limited-partnership" || acspFullProfile.type === "unincorporated-entity" || acspFullProfile.type === "non-registered-partnership") {
        updates = unincorporatedChanges(session, acspFullProfile, updatedFullProfile, updates);
    } else {
        updates = soleTraderChanges(session, acspFullProfile, updatedFullProfile, updates);
    }
    return updates;
};

const limtedChanges = (session: Session, acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile, updates: YourUpdates): YourUpdates => {
    if (!deepEquals(acspFullProfile.registeredOfficeAddress, updatedFullProfile.registeredOfficeAddress)) {
        updates.registeredOfficeAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.registeredOfficeAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS)!))
        };
    }
    if (!deepEquals(acspFullProfile.serviceAddress, updatedFullProfile.serviceAddress)) {
        updates.serviceAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.serviceAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS)!))
        };
    }
    return updates;
};

const unincorporatedChanges = (session: Session, acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile, updates: YourUpdates): YourUpdates => {
    if (!deepEquals(acspFullProfile.registeredOfficeAddress, updatedFullProfile.registeredOfficeAddress)) {
        updates.businessAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.registeredOfficeAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS)!))
        };
    }
    if (!deepEquals(acspFullProfile.serviceAddress, updatedFullProfile.serviceAddress)) {
        updates.serviceAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.serviceAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS)!))
        };
    }
    if (acspFullProfile.soleTraderDetails?.forename !== updatedFullProfile.soleTraderDetails?.forename ||
        acspFullProfile.soleTraderDetails?.otherForenames !== updatedFullProfile.soleTraderDetails?.otherForenames ||
        acspFullProfile.soleTraderDetails?.surname !== updatedFullProfile.soleTraderDetails?.surname
    ) {
        updates.name = {
            value: getFullNameACSPFullProfileDetails(updatedFullProfile)!,
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME)!))
        };
    }
    return updates;
};

const soleTraderChanges = (session: Session, acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile, updates: YourUpdates): YourUpdates => {
    if (!deepEquals(acspFullProfile.registeredOfficeAddress, updatedFullProfile.registeredOfficeAddress)) {
        updates.serviceAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.registeredOfficeAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCE_ADDRESS)!))
        };
    }
    if (acspFullProfile.soleTraderDetails?.usualResidentialCountry !== updatedFullProfile.soleTraderDetails?.usualResidentialCountry) {
        updates.usualResidentialCountry = {
            value: updatedFullProfile.soleTraderDetails!.usualResidentialCountry!,
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHERE_DO_YOU_LIVE)!))
        };
    }
    if (acspFullProfile.soleTraderDetails?.forename !== updatedFullProfile.soleTraderDetails?.forename ||
        acspFullProfile.soleTraderDetails?.otherForenames !== updatedFullProfile.soleTraderDetails?.otherForenames ||
        acspFullProfile.soleTraderDetails?.surname !== updatedFullProfile.soleTraderDetails?.surname
    ) {
        updates.name = {
            value: getFullNameACSPFullProfileDetails(updatedFullProfile)!,
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME)!))
        };
    }
    return updates;
};

export const getFormattedRemovedAMLUpdates = (session: Session, acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile): YourAMLUpdates[] => {
    const removedBodies: YourAMLUpdates[] = [];
    const removedAMLDetails: AmlSupervisoryBody[] = session.getExtraData(AML_REMOVED_BODY_DETAILS) ?? [];

    acspFullProfile.amlDetails.forEach(body => {
        if (!updatedFullProfile.amlDetails.find(updatedBody => updatedBody.supervisoryBody === body.supervisoryBody &&
            updatedBody.membershipDetails === body.membershipDetails)) {

            // Find the matching aml body details in removedAMLDetails
            const matchingRemovedDetail = removedAMLDetails.find(removedAml =>
                removedAml.amlSupervisoryBody === body.supervisoryBody &&
                removedAml.membershipId === body.membershipDetails
            );

            // Use the dateOfChange from removedAMLDetails
            const changedDate = matchingRemovedDetail?.dateOfChange
                ? formatDateIntoReadableString(new Date(matchingRemovedDetail.dateOfChange))
                : formatDateIntoReadableString(new Date());

            removedBodies.push({
                membershipName: body.supervisoryBody,
                membershipNumber: body.membershipDetails,
                changedDate: changedDate
            });
        }
    });

    return removedBodies;
};

export const getFormattedAddedAMLUpdates = (acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile): YourAMLUpdates[] => {
    const addedBodies: YourAMLUpdates[] = [];
    updatedFullProfile.amlDetails.forEach(body => {
        if (!acspFullProfile.amlDetails.find(originalBody => originalBody.supervisoryBody === body.supervisoryBody &&
            originalBody.membershipDetails === body.membershipDetails)) {
            addedBodies.push({
                membershipName: body.supervisoryBody,
                membershipNumber: body.membershipDetails,
                changedDate: formatDateIntoReadableString(new Date(body.dateOfChange || new Date()))
            });
        }
    });
    return addedBodies;
};
