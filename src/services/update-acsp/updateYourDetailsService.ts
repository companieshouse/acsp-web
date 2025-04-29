import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { formatAddressIntoHTMLString, getBusinessName, getFullNameACSPFullProfileDetails } from "../../services/common";
import { ACSP_DETAILS_UPDATE_IN_PROGRESS, ACSP_PROFILE_TYPE_SOLE_TRADER, ACSP_USER_DETAILS } from "../../common/__utils/constants";

export const getProfileDetails = (acspFullProfile: AcspFullProfile): ACSPFullProfileDetails => {
    let profileDetails: ACSPFullProfileDetails = {};
    profileDetails.typeOfBusiness = acspFullProfile.type;
    profileDetails.correspondenceEmail = acspFullProfile.email;
    profileDetails.businessName = getBusinessName(acspFullProfile.name);
    profileDetails.registeredOfficeAddress = formatAddressIntoHTMLString(acspFullProfile.registeredOfficeAddress);
    profileDetails.serviceAddress = formatAddressIntoHTMLString(acspFullProfile.serviceAddress);

    if (acspFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER) {
        profileDetails = soleTraderValues(profileDetails, acspFullProfile);
    }
    return profileDetails;
};

const soleTraderValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    profileDetails.name = getFullNameACSPFullProfileDetails(acspProfileData);
    profileDetails.countryOfResidence = acspProfileData.soleTraderDetails!.usualResidentialCountry;
    return profileDetails;
};

export const setPaylodForUpdateInProgress = (req: Request): any => {
    const session: Session = req.session as any as Session;
    const updateInProgressDetails = session.getExtraData(ACSP_DETAILS_UPDATE_IN_PROGRESS);
    let payload;

    if (typeof updateInProgressDetails === "object" && updateInProgressDetails !== null && !Array.isArray(updateInProgressDetails)) {
        payload = Object.entries(updateInProgressDetails || {}).reduce((acc, [key, value]) => {
            if (ACSP_USER_DETAILS[key]) {
                acc[ACSP_USER_DETAILS[key]] = value;
            }
            return acc;
        }, {} as Record<string, any>);
    } else {
        payload = updateInProgressDetails;
    }

    return payload;
};
