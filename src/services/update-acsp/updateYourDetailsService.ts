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
export const validateUpdatesWithoutDate = (req: Request, acspFullProfile: AcspFullProfile, acspUpdatedFullProfile: AcspFullProfile): AcspFullProfile => {
    if (JSON.stringify(acspFullProfile) !== JSON.stringify(acspUpdatedFullProfile)) {
        const session: Session = req.session as any as Session;
        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAMEOFBUSINESS) === null &&
            acspFullProfile.name !== acspUpdatedFullProfile.name) {
            acspUpdatedFullProfile.name = acspFullProfile.name;

        }
        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.NAME) === null &&
            (acspFullProfile.soleTraderDetails?.forename !== acspUpdatedFullProfile.soleTraderDetails?.forename ||
            acspFullProfile.soleTraderDetails?.otherForenames !== acspUpdatedFullProfile.soleTraderDetails?.otherForenames ||
            acspFullProfile.soleTraderDetails?.surname !== acspUpdatedFullProfile.soleTraderDetails?.surname)) {
                acspUpdatedFullProfile.soleTraderDetails!.surname = acspFullProfile.soleTraderDetails!.surname;
                acspUpdatedFullProfile.soleTraderDetails!.otherForenames = acspFullProfile.soleTraderDetails!.otherForenames;
                acspUpdatedFullProfile.soleTraderDetails!.forename = acspFullProfile.soleTraderDetails!.forename;

        }
        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.WHEREDOYOULIVE) === null &&
            acspFullProfile.soleTraderDetails?.usualResidentialCountry !== acspUpdatedFullProfile.soleTraderDetails?.usualResidentialCountry) {
                acspUpdatedFullProfile.soleTraderDetails!.usualResidentialCountry = acspFullProfile.soleTraderDetails!.usualResidentialCountry;

        }
        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.CORRESPONDENCEADDRESS) === null &&
            JSON.stringify(acspFullProfile.registeredOfficeAddress) !== JSON.stringify(acspUpdatedFullProfile.registeredOfficeAddress)) {
            acspUpdatedFullProfile.registeredOfficeAddress = acspFullProfile.registeredOfficeAddress;

        }
        if (session.getExtraData(ACSP_UPDATE_CHANGE_DATE.REGOFFICEADDRESS) === null &&
            JSON.stringify(acspFullProfile.serviceAddress) !== JSON.stringify(acspUpdatedFullProfile.serviceAddress)) {
            acspUpdatedFullProfile.serviceAddress = acspFullProfile.serviceAddress;
        }
    }
    return acspUpdatedFullProfile;
};
