import { Session } from "@companieshouse/node-session-handler";
import { ACSP_DETAILS, ACSP_DETAILS_UPDATED, AML_REMOVED_BODY_DETAILS } from "../../common/__utils/constants";
import { AcspFullProfile } from "private-api-sdk-node/dist/services/acsp-profile/types";
import { Request } from "express";
import { AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export const amlSupervisor = (req: Request): void => {
    const amlRemovalIndex = req.query.amlindex;
    const amlRemovalBody = req.query.amlbody;
    const session: Session = req.session as any as Session;
    const acspFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS)!;
    const acspUpdatedFullProfile: AcspFullProfile = session.getExtraData(ACSP_DETAILS_UPDATED)!;
    const removedAMLDetails: AmlSupervisoryBody[] = session.getExtraData(AML_REMOVED_BODY_DETAILS) ?? [];
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

            // Remove the corresponding entry from AML_REMOVED_BODY_DETAILS
            const updatedRemovedAMLDetails = removedAMLDetails.filter(removedDetail =>
                !(removedDetail.membershipId === amlRemovalIndex && removedDetail.amlSupervisoryBody === amlRemovalBody)
            );
            session.setExtraData(AML_REMOVED_BODY_DETAILS, updatedRemovedAMLDetails);
        }
    }
};
