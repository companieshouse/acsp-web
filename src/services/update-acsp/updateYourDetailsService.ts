import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { AcspFullProfile, Address } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getFullNameACSPFullProfileDetails } from "../../utils/web";
import { ACSP_PROFILE_TYPE_SOLE_TRADER } from "../../common/__utils/constants";

export const getProfileDetails = (acspFullProfile: AcspFullProfile): ACSPFullProfileDetails => {
    let profileDetails: ACSPFullProfileDetails = {};
    profileDetails.typeOfBusiness = acspFullProfile.type;
    profileDetails.correspondenceEmail = acspFullProfile.email;
    let updatedName: string;
    const businessName = acspFullProfile.name.trim();
    if (businessName.toUpperCase().endsWith("ACSP")) {
        updatedName = businessName.slice(0, -4).trimEnd();
    } else {
        updatedName = businessName;
    }
    profileDetails.businessName = updatedName;

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
const discardChangesWithoutDate = (acspFullProfile: AcspFullProfile, acspUpdatedFullProfile: AcspFullProfile): AcspFullProfile => {
    if  (JSON.stringify(acspFullProfile) !== JSON.stringify(acspUpdatedFullProfile)){
        
    }
    return acspUpdatedFullProfile;
};