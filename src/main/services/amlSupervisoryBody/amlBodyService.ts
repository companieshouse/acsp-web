import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";
import { AcspData } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class AmlSupervisoryBodyService {
    public saveSelectedAML = (session: Session, req: Request, acspData: AcspData) => {
        const selectedAMLSupervisoryBodies = req.body["AML-supervisory-bodies"];
        if (selectedAMLSupervisoryBodies instanceof Array) {
            acspData.amlSupervisoryBodiesSelected = selectedAMLSupervisoryBodies;
        } else {
            const selectedAML: string[] = [];
            selectedAML.push(selectedAMLSupervisoryBodies);
            acspData.amlSupervisoryBodiesSelected = selectedAML;
        }
    }
}
