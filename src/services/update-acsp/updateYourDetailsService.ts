import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { Request } from "express";
import { AcspFullProfile, Address } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getFullNameACSPFullProfileDetails } from "../../utils/web";
import { ACSP_PROFILE_TYPE_LIMITED_COMPANY, ACSP_PROFILE_TYPE_LIMITED_LIABILITY_PARTNERSHIP, ACSP_PROFILE_TYPE_CORPORATE_BODY, ACSP_PROFILE_TYPE_SOLE_TRADER } from "../../common/__utils/constants";

export const getProfileDetails = (acspFullProfile: AcspFullProfile): ACSPFullProfileDetails => {
    let profileDetails: ACSPFullProfileDetails = {};
    profileDetails.typeOfBusiness = acspFullProfile.type;
    profileDetails.correspondenceEmail = acspFullProfile.email;
    let updatedName: string;
    const businessName = acspFullProfile.name.trim();
    console.log("Business name ----->", businessName);
    if (businessName.toUpperCase().endsWith("ACSP")) {
        console.log("TRUE ---------");
        updatedName = businessName.slice(0, -4).trimEnd();
    } else {
        updatedName = businessName;
    }
    profileDetails.businessName = updatedName;

    if (acspFullProfile.type === ACSP_PROFILE_TYPE_LIMITED_COMPANY || acspFullProfile.type === ACSP_PROFILE_TYPE_LIMITED_LIABILITY_PARTNERSHIP || acspFullProfile.type === ACSP_PROFILE_TYPE_CORPORATE_BODY) {
        profileDetails = limitedValues(profileDetails, acspFullProfile);
    } else if (acspFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER) {
        profileDetails = soleTraderValues(profileDetails, acspFullProfile);
    } else {
        profileDetails = unincorporatedValues(profileDetails, acspFullProfile);
    }
    return profileDetails;
};

const limitedValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
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

const unincorporatedValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
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
