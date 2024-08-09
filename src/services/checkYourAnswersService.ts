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
    let correspondenceAddressAnswer = acspData.correspondenceAddress?.propertyDetails +
    " " + acspData.correspondenceAddress?.line1;

    if (acspData.correspondenceAddress?.line2) {
        correspondenceAddressAnswer += "<br>" + acspData.correspondenceAddress.line2;
    }
    if (acspData.correspondenceAddress?.town) {
        correspondenceAddressAnswer += "<br>" + acspData.correspondenceAddress.town;
    }
    if (acspData.correspondenceAddress?.county) {
        correspondenceAddressAnswer += "<br>" + acspData.correspondenceAddress.county;
    }
    if (acspData.correspondenceAddress?.country) {
        correspondenceAddressAnswer += "<br>" + acspData.correspondenceAddress.country;
    }
    if (acspData.correspondenceAddress?.postcode) {
        correspondenceAddressAnswer += "<br>" + acspData.correspondenceAddress.postcode;
    }

    detailsAnswers.correspondenceAddress = correspondenceAddressAnswer;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
};

export const businessAddressAnswers = (req: Request, acspData: AcspData): void => {
    const session: Session = req.session as any as Session;
    const detailsAnswers: Answers = session.getExtraData(ANSWER_DATA) || {};
    let businessAddressAnswer = acspData.businessAddress?.propertyDetails +
    " " + acspData.businessAddress?.line1;

    if (acspData.businessAddress?.line2) {
        businessAddressAnswer += "<br>" + acspData.businessAddress.line2;
    }
    if (acspData.businessAddress?.town) {
        businessAddressAnswer += "<br>" + acspData.businessAddress.town;
    }
    if (acspData.businessAddress?.county) {
        businessAddressAnswer += "<br>" + acspData.businessAddress.county;
    }
    if (acspData.businessAddress?.country) {
        businessAddressAnswer += "<br>" + acspData.businessAddress.country;
    }
    if (acspData.businessAddress?.postcode) {
        businessAddressAnswer += "<br>" + acspData.businessAddress.postcode;
    }

    detailsAnswers.businessAddress = businessAddressAnswer;
    saveDataInSession(req, ANSWER_DATA, detailsAnswers);
};
