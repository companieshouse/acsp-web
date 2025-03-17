import { Session } from "@companieshouse/node-session-handler";
import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { AcspFullProfile, Address } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { ACSP_PROFILE_TYPE_SOLE_TRADER, ACSP_UPDATE_CHANGE_DATE } from "../../common/__utils/constants";
import { Request } from "express";
import { getBusinessName, getFullNameACSPFullProfileDetails } from "../../utils/web";

export const getProfileDetails = (acspFullProfile: AcspFullProfile): ACSPFullProfileDetails => {
    let profileDetails: ACSPFullProfileDetails = {};
    profileDetails.typeOfBusiness = acspFullProfile.type;
    profileDetails.correspondenceEmail = acspFullProfile.email;
    profileDetails.businessName = getBusinessName(acspFullProfile.name);

    if (acspFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER) {
        profileDetails = soleTraderValues(profileDetails, acspFullProfile);
    } else {
        profileDetails = limitedAndUnincorporatedValues(profileDetails, acspFullProfile);
    }
    return profileDetails;
};

const limitedAndUnincorporatedValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    profileDetails.registeredOfficeAddress = addressFormation(acspProfileData.registeredOfficeAddress);
    profileDetails.serviceAddress = addressFormation(acspProfileData.serviceAddress);
    return profileDetails;
};

const soleTraderValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    profileDetails.name = getFullNameACSPFullProfileDetails(acspProfileData);
    profileDetails.correspondenceEmail = acspProfileData.email;
    profileDetails.countryOfResidence = acspProfileData.soleTraderDetails!.usualResidentialCountry;
    profileDetails.registeredOfficeAddress = addressFormation(acspProfileData.registeredOfficeAddress);
    profileDetails.serviceAddress = addressFormation(acspProfileData.serviceAddress);
    return profileDetails;
};

const addressFormation = (givenAddress: Address | undefined): string => {
    let formattedAddress = "";

    if (!givenAddress) {
        return formattedAddress;
    }
    const { premises, addressLine1, addressLine2, locality, region, country, postalCode } = givenAddress;

    const businessAddressAnswerFields = { premises, addressLine1, addressLine2, locality, region, country, postalCode };

    for (const [field, value] of Object.entries(businessAddressAnswerFields)) {
        if (value) {
            if (field === "premises") {
                formattedAddress += value;
            } else if (field === "addressLine1") {
                formattedAddress += (formattedAddress ? " " : "") + value;
            } else {
                formattedAddress += "<br>" + value;
            }
        }
    }
    return formattedAddress;
};
