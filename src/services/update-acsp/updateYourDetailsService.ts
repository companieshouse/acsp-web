import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { Request } from "express";
import { AcspFullProfile, Address } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getFullNameACSPFullProfileDetails } from "../../utils/web";
import { ACSP_PROFILE_TYPE_LIMITED_COMPANY, ACSP_PROFILE_TYPE_LIMITED_LIABILITY_PARTNERSHIP, ACSP_PROFILE_TYPE_CORPORATE_BODY, ACSP_PROFILE_TYPE_SOLE_TRADER } from "../../common/__utils/constants";

export const getProfileDetails = (req: Request, acspFullProfile: AcspFullProfile, i18n: any): ACSPFullProfileDetails => {
    let profileDetails: ACSPFullProfileDetails = {};
    profileDetails.typeOfBusiness = acspFullProfile.type;
    profileDetails.correspondenceEmail = acspFullProfile.email;
    profileDetails.businessName = acspFullProfile.name;

    if (acspFullProfile.type === ACSP_PROFILE_TYPE_LIMITED_COMPANY || acspFullProfile.type === ACSP_PROFILE_TYPE_LIMITED_LIABILITY_PARTNERSHIP || acspFullProfile.type === ACSP_PROFILE_TYPE_CORPORATE_BODY) {
        profileDetails = limitedValues(req, profileDetails, acspFullProfile);
    } else if (acspFullProfile.type === ACSP_PROFILE_TYPE_SOLE_TRADER) {
        profileDetails = soleTraderValues(profileDetails, acspFullProfile);
    } else {
        profileDetails = unincorporatedValues(profileDetails, acspFullProfile, i18n);
    }
    return profileDetails;
};

const limitedValues = (req: Request, profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    profileDetails.correspondenceAddress = addressFormation(acspProfileData.registeredOfficeAddress);
    return profileDetails;
};

const soleTraderValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    profileDetails.businessName = acspProfileData.name;
    profileDetails.name = getFullNameACSPFullProfileDetails(acspProfileData);
    profileDetails.correspondenceEmail = acspProfileData.email;
    profileDetails.countryOfResidence = acspProfileData.soleTraderDetails!.usualResidentialCountry;
    profileDetails.correspondenceAddress = addressFormation(acspProfileData.registeredOfficeAddress);
    return profileDetails;
};

const unincorporatedValues = (profileDetails: ACSPFullProfileDetails, acspProfileData: AcspFullProfile, i18n: any): ACSPFullProfileDetails => {
    profileDetails.businessAddress = businessAddressValues(acspProfileData);
    profileDetails.correspondenceAddress = addressFormation(acspProfileData.registeredOfficeAddress);
    return profileDetails;
};

export const businessAddressValues = (acspProfileData: AcspFullProfile): string => {
    const serviceAddress = acspProfileData.serviceAddress!;
    return addressFormation(serviceAddress);
};

const addressFormation = (givenAddress: Address): string => {
    let formattedAddress = "";

    if (!givenAddress) {
        givenAddress = {};
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
