import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AML_SUPERVISOR_SELECTED } from "../../common/__utils/constants";

export const saveSelectedAML = (session: Session, req: Request) => {
    const selectedAMLSupervisoryBodies = req.body["AML-supervisory-bodies"];
    if (selectedAMLSupervisoryBodies instanceof Array) {
        session.setExtraData(AML_SUPERVISOR_SELECTED, selectedAMLSupervisoryBodies);
    } else {
        const selectedAML : string[] = [];
        selectedAML.push(selectedAMLSupervisoryBodies);
        session.setExtraData(AML_SUPERVISOR_SELECTED, selectedAML);
    }
};
