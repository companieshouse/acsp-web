import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED } from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Request } from "express";

export const removeAMLSupervisor = (req: Request): void => {
    const amlRemovalIndex = req.query.amlindex;
    const session: Session = req.session as any as Session;
    const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    if (amlRemovalIndex) {
        const indexAMLForRemoval = acspUpdatedFullProfile.amlDetails.findIndex(tmpRemovedAml => tmpRemovedAml.membershipDetails === amlRemovalIndex);
        const indexAMLForUndoRemoval = acspFullProfile.amlDetails.findIndex(tmpRemovedAml => tmpRemovedAml.membershipDetails === amlRemovalIndex);
        if (indexAMLForRemoval >= 0) {
            acspUpdatedFullProfile.amlDetails[indexAMLForRemoval].membershipDetails = "";
            acspUpdatedFullProfile.amlDetails[indexAMLForRemoval].supervisoryBody = "";
        } else if (indexAMLForUndoRemoval >= 0 && indexAMLForRemoval === -1) {
            acspUpdatedFullProfile.amlDetails[indexAMLForUndoRemoval].membershipDetails = acspFullProfile.amlDetails[indexAMLForUndoRemoval].membershipDetails;
            acspUpdatedFullProfile.amlDetails[indexAMLForUndoRemoval].supervisoryBody = acspFullProfile.amlDetails[indexAMLForUndoRemoval].supervisoryBody;
        }
    }
};
