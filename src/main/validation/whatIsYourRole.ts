import { Session } from "@companieshouse/node-session-handler";
import { body, ValidationChain } from "express-validator";
import { ACSPData } from "../model/ACSPData";
import { USER_DATA } from "../common/__utils/constants";
import logger from "../../../lib/Logger";

export const whatIsYourRoleValidator: ValidationChain[] = [
    body("WhatIsYourRole").trim().custom((value, { req }) => {
        const session: Session = req.session as any as Session;
        const acspData: ACSPData = session?.getExtraData(USER_DATA)!;
        logger.debug("++++++++++++++++++++++++++++++++++" + acspData.typeofBusiness!.toString());
        if (value === "") {
            switch (acspData.typeofBusiness!.toString()) {
            case "LIMITED_COMPANY":
                throw new Error("limitedCompanyWhatIsYourRoleRadio");
            case "LIMITED_PARTNERSHIP":
            case "PARTNERSHIP":
                throw new Error("partnershipWhatIsYourRoleRadio");
            case "LIMITED_LIABILITY_PARTNERSHIP":
                throw new Error("limitedLPWhatIsYourRoleRadio");
            case "SOLE_TRADER":
                throw new Error("soleTraderWhatIsYourRoleRadio");
            case "UNINCORPORATED_ENTITY":
                throw new Error("soleTraderWhatIsYourRoleRadio");
            }
        }
        return true;
    })
];
