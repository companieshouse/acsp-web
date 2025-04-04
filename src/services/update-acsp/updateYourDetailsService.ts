import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { formatAddressIntoHTMLString, getBusinessName, getFullNameACSPFullProfileDetails } from "../../services/common";
import { ACSP_PROFILE_TYPE_SOLE_TRADER } from "../../common/__utils/constants";

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
