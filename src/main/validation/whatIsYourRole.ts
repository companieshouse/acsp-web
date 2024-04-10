import { Session } from "@companieshouse/node-session-handler";
import { body, ValidationChain } from "express-validator";
import { ACSPData } from "../model/ACSPData";
import { USER_DATA } from "../common/__utils/constants";

export const whatIsYourRoleValidator: ValidationChain[] = [
    body("WhatIsYourRole").custom((value, { req }) => {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
        if (value.trim() === "") {
            switch (acspData.typeofBusiness!) {
            case "Limited company":
                throw new Error("limitedCompanyWhatIsYourRoleRadio");
            case "Limited partnership":
            case "Non registered partnership":
                throw new Error("partnershipWhatIsYourRoleRadio");
            case "Limited Liability Partnership":
                throw new Error("limitedLPWhatIsYourRoleRadio");
            case "Sole trader":
                throw new Error("soleTraderWhatIsYourRoleRadio");
            }
        }
        return true;
    })
];
