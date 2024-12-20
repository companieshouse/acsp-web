import { ACSPFullProfileDetails } from "../../model/ACSPFullProfileDetails";
import { Request } from "express";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { getFullNameACSPFullProfileDetails } from "../../utils/web";

const typeOfBusinessTranslated = (typeOfBusiness: string, i18n: any): string => {
    switch (typeOfBusiness) {
    case "limited-company":
        return i18n.typeOfBusinessLimitedCompanyOption;
    case "limited-partnership":
        return i18n.typeOfBusinessLimitedPartnershipOption;
    case "limited-liability-partnership":
        return i18n.typeOfBusinessLimitedLiabilityPartnershipsOption;
    case "non-registered-partnership":
        return i18n.typeOfBusinessPartnershipNotRegisteredWithCompaniesHouseOption;
    case "sole-trader":
        return i18n.typeOfBusinessSoleTraderOption;
    case "unincorporated-entity":
        return i18n.otherTypeOfBusinessUnincorporatedEntity;
    case "corporate-body":
        return i18n.otherTypeOfBusinessCorporateBody;
    default:
        return typeOfBusiness;
    }
};

export const getProfileDetails = (req: Request, acspFullProfile: AcspFullProfile, i18n: any): ACSPFullProfileDetails => {
    let profileDetails: ACSPFullProfileDetails = {};
    profileDetails.typeOfBusiness = typeOfBusinessTranslated(acspFullProfile.type!, i18n);
    profileDetails.correspondenceEmail = acspFullProfile.email;
    profileDetails.businessName = acspFullProfile.name;

    if (acspFullProfile.type === "limited-company" || acspFullProfile.type === "limited-liability-partnership" || acspFullProfile.type === "corporate-body") {
        profileDetails = limitedAnswers(req, profileDetails, acspFullProfile);
    } else if (acspFullProfile.type === "sole-trader") {
        profileDetails = soleTraderAnswers(profileDetails, acspFullProfile);
    } else {
        profileDetails = unincorporatedAnswers(profileDetails, acspFullProfile, i18n);
    }
    return profileDetails;
};

const limitedAnswers = (req: Request, answers: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    answers.correspondenceAddress = correspondenceAddressAnswers(acspProfileData);
    return answers;
};

const soleTraderAnswers = (answers: ACSPFullProfileDetails, acspProfileData: AcspFullProfile): ACSPFullProfileDetails => {
    answers.businessName = acspProfileData.name;
    answers.name = getFullNameACSPFullProfileDetails(acspProfileData);
    answers.correspondenceEmail = acspProfileData.email;
    answers.countryOfResidence = acspProfileData.soleTraderDetails?.nationality;
    // answers.businessName = acspData.businessName;
    answers.correspondenceAddress = correspondenceAddressAnswers(acspProfileData);
    return answers;
};

const unincorporatedAnswers = (answers: ACSPFullProfileDetails, acspProfileData: AcspFullProfile, i18n: any): ACSPFullProfileDetails => {

    // answers.businessName = acspData.businessName;
    answers.businessAddress = businessAddressAnswers(acspProfileData);
    answers.correspondenceAddress = correspondenceAddressAnswers(acspProfileData);
    return answers;
};

const correspondenceAddressAnswers = (acspProfileData: AcspFullProfile): string => {
    let correspondenceAddressAnswer = "";
    const applicantDetails = acspProfileData.registeredOfficeAddress;
    if (applicantDetails?.premises) {
        correspondenceAddressAnswer += applicantDetails?.premises;
    }
    if (applicantDetails?.addressLine1) {
        correspondenceAddressAnswer += (correspondenceAddressAnswer ? " " : "") + applicantDetails?.addressLine1;
    }

    if (applicantDetails?.addressLine2) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.addressLine2;
    }
    if (applicantDetails?.locality) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.locality;
    }
    if (applicantDetails?.region) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.region;
    }
    if (applicantDetails?.country) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.country;
    }
    if (applicantDetails?.postalCode) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.postalCode;
    }

    return correspondenceAddressAnswer;
};

const businessAddressAnswers = (acspProfileData: AcspFullProfile): string => {
    let businessAddressAnswer = "";
    if (acspProfileData.serviceAddress?.premises) {
        businessAddressAnswer += acspProfileData.serviceAddress?.premises;
    }
    if (acspProfileData.serviceAddress?.addressLine1) {
        businessAddressAnswer += (businessAddressAnswer ? " " : "") + acspProfileData.serviceAddress?.addressLine1;
    }
    if (acspProfileData.serviceAddress?.addressLine2) {
        businessAddressAnswer += "<br>" + acspProfileData.serviceAddress.addressLine2;
    }
    if (acspProfileData.serviceAddress?.locality) {
        businessAddressAnswer += "<br>" + acspProfileData.serviceAddress.locality;
    }
    if (acspProfileData.serviceAddress?.region) {
        businessAddressAnswer += "<br>" + acspProfileData.serviceAddress.region;
    }
    if (acspProfileData.serviceAddress?.country) {
        businessAddressAnswer += "<br>" + acspProfileData.serviceAddress.country;
    }
    if (acspProfileData.serviceAddress?.postalCode) {
        businessAddressAnswer += "<br>" + acspProfileData.serviceAddress.postalCode;
    }

    return businessAddressAnswer;
};
