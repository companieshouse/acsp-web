import { Session } from "@companieshouse/node-session-handler";
import { ANSWER_DATA } from "../common/__utils/constants";
import { Answers } from "../model/Answers";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";
import { saveDataInSession } from "../common/__utils/sessionHelper";
import { Request } from "express";
import { Company } from "../model/Company";

export const isThisYourCompanyAnswers = (req: Request, company: Company): void => {
    const session: Session = req.session as any as Session;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
    detailsAnswers.businessName = company.companyName;
    detailsAnswers.companyNumber = company.companyNumber;
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

    detailsAnswers.businessAddress = businessAddressAnswer;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
};

export const correspondenceAddressAnswers = (req: Request, acspData: AcspData): void => {
    const session: Session = req.session as any as Session;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
    const applicantDetails = acspData.applicantDetails || {};
    let correspondenceAddressAnswer =
      applicantDetails.correspondenceAddress?.premises +
      " " +
      applicantDetails.correspondenceAddress?.addressLine1;

    if (applicantDetails.correspondenceAddress?.addressLine2) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.correspondenceAddress.addressLine2;
    }
    if (applicantDetails.correspondenceAddress?.locality) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.correspondenceAddress.locality;
    }
    if (applicantDetails.correspondenceAddress?.region) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.correspondenceAddress.region;
    }
    if (applicantDetails.correspondenceAddress?.country) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.correspondenceAddress.country;
    }
    if (applicantDetails.correspondenceAddress?.postalCode) {
        correspondenceAddressAnswer +=
        "<br>" + applicantDetails.correspondenceAddress.postalCode;
    }
    acspData.applicantDetails = applicantDetails;
    detailsAnswers.correspondenceAddress = correspondenceAddressAnswer;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
};

export const businessAddressAnswers = (req: Request, acspData: AcspData): void => {
    const session: Session = req.session as any as Session;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
    let businessAddressAnswer = acspData.registeredOfficeAddress?.premises +
    " " + acspData.registeredOfficeAddress?.addressLine1;

    if (acspData.registeredOfficeAddress?.addressLine2) {
        businessAddressAnswer += "<br>" + acspData.registeredOfficeAddress.addressLine2;
    }
    if (acspData.registeredOfficeAddress?.locality) {
        businessAddressAnswer += "<br>" + acspData.registeredOfficeAddress.locality;
    }
    if (acspData.registeredOfficeAddress?.region) {
        businessAddressAnswer += "<br>" + acspData.registeredOfficeAddress.region;
    }
    if (acspData.registeredOfficeAddress?.country) {
        businessAddressAnswer += "<br>" + acspData.registeredOfficeAddress.country;
    }
    if (acspData.registeredOfficeAddress?.postalCode) {
        businessAddressAnswer += "<br>" + acspData.registeredOfficeAddress.postalCode;
    }

    detailsAnswers.businessAddress = businessAddressAnswer;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
};
