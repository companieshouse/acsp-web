import { Session } from "@companieshouse/node-session-handler";
import { body, ValidationChain } from "express-validator";
import { ACSPData } from "../model/ACSPData";
import { USER_DATA } from "../common/__utils/constants";

export const whatIsYourRoleValidator: ValidationChain[] = [
    body("WhatIsYourRole").trim().custom((value, { req }) => {
        const session: Session = req.session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
        if (value === "") {
            switch (acspData.typeOfBusiness!.toString()) {
            case "LC":
                throw new Error("limitedCompanyWhatIsYourRoleRadio");
            case "LP":
                throw new Error("limitedPWhatIsYourRoleRadio");
            case "LLP":
                throw new Error("llppartnershipWhatIsYourRoleRadio");
            case "PARTNERSHIP":
                throw new Error("nonRegistrablePartnership");
            case "SOLE_TRADER":
                throw new Error("soleTraderWhatIsYourRoleRadio");
            case "UNINCORPORATED":
                throw new Error("unincorporatedEntityWhatIsYourRoleRadio");
            case "CORPORATE_BODY":
                throw new Error("unincorporatedEntityWhatIsYourRoleRadio");
            }
        }
        return true;
    })
];
