import { Session } from "@companieshouse/node-session-handler";
import { COMPANY_DETAILS } from "../common/__utils/constants";
import { Answers } from "../model/Answers";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { Request } from "express";
import { Company } from "../model/Company";
import { formatAddressIntoHTMLString, formatDateIntoReadableString, getFullName } from "../services/common";

const typeOfBusinessTranslated = (typeOfBusiness: string, i18n: any): string => {
    switch (typeOfBusiness) {
    case "LC":
        return i18n.typeOfBusinessLimitedCompanyOption;
    case "LP":
        return i18n.typeOfBusinessLimitedPartnershipOption;
    case "LLP":
        return i18n.typeOfBusinessLimitedLiabilityPartnershipsOption;
    case "PARTNERSHIP":
        return i18n.typeOfBusinessPartnershipNotRegisteredWithCompaniesHouseOption;
    case "SOLE_TRADER":
        return i18n.typeOfBusinessSoleTraderOption;
    case "UNINCORPORATED":
        return i18n.otherTypeOfBusinessUnincorporatedEntity;
    case "CORPORATE_BODY":
        return i18n.otherTypeOfBusinessCorporateBody;
    default:
        return typeOfBusiness;
    }
};

const roleTranslated = (role: string, i18n: any): string => {
    switch (role) {
    case "SOLE_TRADER":
        return i18n.soleTrader;
    case "MEMBER_OF_PARTNERSHIP":
    case "MEMBER_OF_ENTITY":
        return i18n.iAmAMember;
    case "MEMBER_OF_GOVERNING_BODY":
        return i18n.iAmAMemberOfGoverningBody;
    case "EQUIVALENT_OF_DIRECTOR":
        return i18n.iAmEquivalentToDirector;
    case "DIRECTOR":
        return i18n.iAmADirector;
    case "MEMBER_OF_LLP":
        return i18n.iAmAmemberOfPartnership;
    case "GENERAL_PARTNER":
        return i18n.IAmAGeneralPartner;
    default:
        return role;
    }
};

const sectorTranslated = (sector: string, i18n: any): string => {
    switch (sector) {
    case "AIP":
        return i18n.sectorYouWorkInAuditorsInsolvencyPractitionersOption;
    case "ILP":
        return i18n.sectorYouWorkInIndependentLegalProfessionalsOption;
    case "TCSP":
        return i18n.sectorYouWorkInTrustOrCompanyServiceProvidersOption;
    case "CI":
        return i18n.sectorYouWorkInCreditInstitutionsOption;
    case "FI":
        return i18n.sectorYouWorkInFinancialInstitutionsOption;
    case "EA":
        return i18n.whichSectorOtherEstateAgentsOption;
    case "HVD":
        return i18n.whichSectorOtherHighValueDealersOption;
    case "CASINOS":
        return i18n.whichSectorOtherCasinosOption;
    case "PNTS":
        return i18n.sectorYouWorkInPreferNotToSayOption;
    default:
        return sector;
    }
};

const nameRegisteredWithAMLTranslated = (aml: string, i18n: any): string => {
    switch (aml) {
    case "NAME_OF_THE_BUSINESS":
        return i18n.nameRegisteredWithAmlNameOfTheBusinessOption;
    case "YOUR_NAME":
        return i18n.nameRegisteredWithAmlYourNameOption;
    case "BOTH":
        return i18n.nameRegisteredWithAmlBothOption;
    default:
        return aml;
    }
};

export const getAnswers = (req: Request, acspData: AcspData, i18n: any): Answers => {
    let answers: Answers = {};
    answers.typeOfBusiness = typeOfBusinessTranslated(acspData.typeOfBusiness!, i18n);
    answers.roleType = roleTranslated(acspData.roleType!, i18n);
    answers.correspondenceEmail = acspData.applicantDetails?.correspondenceEmail;
    answers.workSector = sectorTranslated(acspData.workSector!, i18n);
    answers.correspondenceAddress = formatAddressIntoHTMLString(acspData.applicantDetails?.correspondenceAddress);

    if (acspData.typeOfBusiness === "LC" || acspData.typeOfBusiness === "LLP" || acspData.typeOfBusiness === "CORPORATE_BODY") {
        answers = isThisYourCompanyAnswers(req, answers);
    } else if (acspData.typeOfBusiness === "SOLE_TRADER") {
        answers = soleTraderAnswers(answers, acspData);
    } else {
        answers = unincorporatedAnswers(answers, acspData, i18n);
    }
    return answers;
};

const soleTraderAnswers = (answers: Answers, acspData: AcspData): Answers => {
    const applicantDetails = acspData.applicantDetails!;
    answers.name = getFullName(acspData);
    answers.dateOfBirth = formatDateIntoReadableString(new Date(applicantDetails.dateOfBirth!));
    let nationalityString = applicantDetails.nationality?.firstNationality!;
    if (applicantDetails.nationality?.secondNationality !== "") {
        nationalityString += ", " + applicantDetails.nationality?.secondNationality;
    }
    if (applicantDetails.nationality?.thirdNationality !== "") {
        nationalityString += ", " + applicantDetails.nationality?.thirdNationality;
    }
    answers.nationality = nationalityString;
    answers.countryOfResidence = applicantDetails.countryOfResidence;
    answers.businessName = acspData.businessName;
    return answers;
};

const unincorporatedAnswers = (answers: Answers, acspData: AcspData, i18n: any): Answers => {
    answers.nameRegisteredWithAML = nameRegisteredWithAMLTranslated(acspData.howAreYouRegisteredWithAml!, i18n);
    if (acspData.howAreYouRegisteredWithAml !== "NAME_OF_THE_BUSINESS") {
        answers.name = getFullName(acspData);
    }
    answers.businessName = acspData.businessName;
    answers.businessAddress = formatAddressIntoHTMLString(acspData.registeredOfficeAddress);
    return answers;
};

const isThisYourCompanyAnswers = (req: Request, answers: Answers): Answers => {
    const session: Session = req.session as any as Session;
    const company: Company = session.getExtraData(COMPANY_DETAILS)!;
    answers.businessName = company.companyName;
    answers.companyNumber = company.companyNumber;
    let businessAddressAnswer = company.registeredOfficeAddress?.addressLineOne;

    if (company.registeredOfficeAddress?.addressLineTwo) {
        businessAddressAnswer += "<br>" + company.registeredOfficeAddress?.addressLineTwo;
    }
    if (company.registeredOfficeAddress?.locality) {
        businessAddressAnswer += "<br>" + company.registeredOfficeAddress?.locality;
    }
    if (company.registeredOfficeAddress?.region) {
        businessAddressAnswer += "<br>" + company.registeredOfficeAddress?.region;
    }
    if (company.registeredOfficeAddress?.postalCode) {
        businessAddressAnswer += "<br>" + company.registeredOfficeAddress?.postalCode;
    }
    if (company.registeredOfficeAddress?.country) {
        businessAddressAnswer += "<br>" + company.registeredOfficeAddress?.country;
    }

    answers.businessAddress = businessAddressAnswer;
    return answers;
};
