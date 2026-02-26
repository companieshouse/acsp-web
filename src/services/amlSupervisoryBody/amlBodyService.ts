import { Request } from "express";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class AmlSupervisoryBodyService {
    public saveSelectedAML = (req: Request, acspData: AcspData) => {
        const selectedAMLSupervisoryBodiesFromForm = req.body["AML-supervisory-bodies"];
        let selectedAMLSupervisoryBodies: Array<string>;
        selectedAMLSupervisoryBodies = [];

        if (!(selectedAMLSupervisoryBodiesFromForm instanceof Array)) {
            selectedAMLSupervisoryBodies.push(selectedAMLSupervisoryBodiesFromForm);
        } else {
            selectedAMLSupervisoryBodies = selectedAMLSupervisoryBodiesFromForm;
        }

        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = (!acspData.amlSupervisoryBodies || acspData.amlSupervisoryBodies?.length === 0)
            ? [] : acspData.amlSupervisoryBodies;

        const previouslySelectedAmlBodiesName: Array<string> = [];
        if (amlSupervisoryBodies.length > 0) {
            amlSupervisoryBodies.forEach((amlSupervisoryBody) => {
                previouslySelectedAmlBodiesName.push(amlSupervisoryBody.amlSupervisoryBody!);
            });
        }

        this.getAMLBodiesNotInCurrentSelection(selectedAMLSupervisoryBodies, previouslySelectedAmlBodiesName, amlSupervisoryBodies);

        if (acspData) {
            acspData.amlSupervisoryBodies = amlSupervisoryBodies;
        }
    };

    public saveAmlSupervisoryBodies = (req: Request, acspData: AcspData) => {
        const amlSupervisoryBodiesNew: Array<AmlSupervisoryBody> = [];
        for (let i = 0; i < acspData.amlSupervisoryBodies!.length; i++) {
            const j = i + 1;
            const id = "membershipNumber_" + j;
            amlSupervisoryBodiesNew.push({
                amlSupervisoryBody: acspData.amlSupervisoryBodies![i].amlSupervisoryBody,
                membershipId: req.body[id]
            });
        }

        if (acspData) {
            acspData.amlSupervisoryBodies = amlSupervisoryBodiesNew;
        }
    };

    public getSelectedAML = (acspData: AcspData, selectedAMLSupervisoryBodies: Array<string>) => {
        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = acspData.amlSupervisoryBodies!;
        if (amlSupervisoryBodies) {
            for (const amlSupervisoryBody of amlSupervisoryBodies) {
                selectedAMLSupervisoryBodies.push(amlSupervisoryBody.amlSupervisoryBody!);
            }
        }

    };

    getAMLBodiesNotInCurrentSelection = (selectedAMLSupervisoryBodies: string[], previouslySelectedAmlBodiesName: string[], amlSupervisoryBodies: AmlSupervisoryBody[]) => {
        let amlSupervisoryBodiesNotInCurrentSelection: Array<AmlSupervisoryBody>;
        if (selectedAMLSupervisoryBodies instanceof Array) {
            selectedAMLSupervisoryBodies.forEach(selectedAMLSupervisoryBody => {
                if (previouslySelectedAmlBodiesName.length === 0 || (previouslySelectedAmlBodiesName.length > 0 && !previouslySelectedAmlBodiesName.includes(selectedAMLSupervisoryBody))) {
                    amlSupervisoryBodies.push({ amlSupervisoryBody: selectedAMLSupervisoryBody });
                }
            });
            amlSupervisoryBodiesNotInCurrentSelection = [];
            amlSupervisoryBodies.forEach(amlSupervisoryBody => {
                if (!selectedAMLSupervisoryBodies.includes(amlSupervisoryBody.amlSupervisoryBody!)) {
                    amlSupervisoryBodiesNotInCurrentSelection.push(amlSupervisoryBody);
                }
            });

            if (amlSupervisoryBodiesNotInCurrentSelection.length > 0) {
                amlSupervisoryBodiesNotInCurrentSelection.forEach(amlSupervisoryBodyToBeRemoved => {
                    const index = amlSupervisoryBodies.indexOf(amlSupervisoryBodyToBeRemoved);
                    amlSupervisoryBodies.splice(index, 1);
                });
            }
        }
        return amlSupervisoryBodies;
    };

}
