import { Session } from "@companieshouse/node-session-handler";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { formatAddressIntoHTMLString, formatDateIntoReadableString, getFullNameACSPFullProfileDetails } from "../../services/common";
import { ACSP_UPDATE_CHANGE_DATE } from "../../common/__utils/constants";

interface YourUpdates {
    name?: {value: string, changedDate: string};
    businessName?: {value: string, changedDate: string};
    correspondenceEmail?: {value: string, changedDate: string};
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
            value: updatedFullProfile.email,
            changedDate: formatDateIntoReadableString(new Date())
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
    if (JSON.stringify(acspFullProfile.registeredOfficeAddress) !== JSON.stringify(updatedFullProfile.registeredOfficeAddress)) {
        updates.registeredOfficeAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.registeredOfficeAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS)!))
        };
    }
    if (JSON.stringify(acspFullProfile.serviceAddress) !== JSON.stringify(updatedFullProfile.serviceAddress)) {
        updates.serviceAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.serviceAddress),
            changedDate: formatDateIntoReadableString(new Date())
        };
    }
    return updates;
};

const unincorporatedChanges = (session: Session, acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile, updates: YourUpdates): YourUpdates => {
    if (JSON.stringify(acspFullProfile.registeredOfficeAddress) !== JSON.stringify(updatedFullProfile.registeredOfficeAddress)) {
        updates.businessAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.registeredOfficeAddress),
            changedDate: formatDateIntoReadableString(new Date(session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGISTERED_OFFICE_ADDRESS)!))
        };
    }
    if (JSON.stringify(acspFullProfile.serviceAddress) !== JSON.stringify(updatedFullProfile.serviceAddress)) {
        updates.serviceAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.serviceAddress),
            changedDate: formatDateIntoReadableString(new Date())
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
    if (JSON.stringify(acspFullProfile.registeredOfficeAddress) !== JSON.stringify(updatedFullProfile.registeredOfficeAddress)) {
        updates.serviceAddress = {
            value: formatAddressIntoHTMLString(updatedFullProfile.registeredOfficeAddress),
            changedDate: formatDateIntoReadableString(new Date())
        };
    }
    if (acspFullProfile.soleTraderDetails?.usualResidentialCountry !== updatedFullProfile.soleTraderDetails?.usualResidentialCountry) {
        updates.usualResidentialCountry = {
            value: updatedFullProfile.soleTraderDetails!.usualResidentialCountry!,
            changedDate: formatDateIntoReadableString(new Date())
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

export const getFormattedRemovedAMLUpdates = (acspFullProfile: AcspFullProfile, updatedFullProfile: AcspFullProfile): YourAMLUpdates[] => {
    const removedBodies: YourAMLUpdates[] = [];
    acspFullProfile.amlDetails.forEach(body => {
        if (!updatedFullProfile.amlDetails.find(updatedBody => updatedBody.supervisoryBody === body.supervisoryBody &&
            updatedBody.membershipDetails === body.membershipDetails)) {
            removedBodies.push({
                membershipName: body.supervisoryBody,
                membershipNumber: body.membershipDetails,
                changedDate: formatDateIntoReadableString(new Date())
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
                changedDate: formatDateIntoReadableString(new Date())
            });
        }
    });
    return addedBodies;
};
