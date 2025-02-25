import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Request } from "express";

export const amlSupervisor = (req: Request): void => {
    const amlRemovalIndex = req.query.amlindex;
    const amlRemovalBody = req.query.amlbody;
    const session: Session = req.session as any as Session;
    const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    if (amlRemovalIndex && amlRemovalBody) {
        const indexAMLForRemoval = acspUpdatedFullProfile.amlDetails.findIndex(tmpRemovedAml => (
            tmpRemovedAml.membershipDetails === amlRemovalIndex && tmpRemovedAml.supervisoryBody === amlRemovalBody
        )
        );
        const indexAMLForUndoRemoval = acspFullProfile.amlDetails.findIndex(tmpRemovedAml => (
            tmpRemovedAml.membershipDetails === amlRemovalIndex && tmpRemovedAml.supervisoryBody === amlRemovalBody
        )
        );
        if (indexAMLForRemoval >= 0) {
            acspUpdatedFullProfile.amlDetails.length > 1
                ? acspUpdatedFullProfile.amlDetails.splice(indexAMLForRemoval, 1) : acspUpdatedFullProfile.amlDetails.pop();
        } else if (indexAMLForUndoRemoval >= 0) {
            acspUpdatedFullProfile.amlDetails.splice(indexAMLForUndoRemoval, 0, acspFullProfile.amlDetails[indexAMLForUndoRemoval]);
        }
    }
};
