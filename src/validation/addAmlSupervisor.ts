import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS_UPDATED } from "../common/__utils/constants";
import { body } from "express-validator";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";

export const addAmlSupervisorValidator = [
    body("AML-supervisory-bodies", "addAmlSupervisor").notEmpty().bail()
        .custom((value, { req }) => {
            const session: Session = req.session as Session;
            const acspDetails: AcspFullProfile | undefined = session.getExtraData(ACSP_DETAILS_UPDATED);
            if (acspDetails && acspDetails.amlDetails.length >= 25) {
                throw new Error("moreThan26SupervisoryBodies");
            }
            return true;
        })
];
