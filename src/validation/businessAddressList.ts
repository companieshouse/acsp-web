import { body, ValidationChain } from "express-validator";
import { AddressListValidationType } from "./correspondanceAddressList";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS } from "../common/__utils/constants";
import { Request } from "express-validator/src/base";
import { isLimitedBusinessType } from "../services/common";

export const businessAddressListValidator = (type: AddressListValidationType): ValidationChain[] => [
    body("businessAddress").notEmpty().withMessage((value, { req }) => getErrorMessage(type, req))
];

const getErrorMessage = (type: AddressListValidationType, req: Request): string => {
    if (type === "registration") {
        return "businessLookUpAddresListNoRadioBtnSelected";
    } else {
        const session: Session = req.session as Session;
        const acspDetails: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
        if (isLimitedBusinessType(acspDetails.type)) {
            return "registeredOfficeLookUpAddresListNoRadioBtnSelectedUpdate";
        } else {
            return "businessLookUpAddresListNoRadioBtnSelectedUpdate";
        }
    }
};
