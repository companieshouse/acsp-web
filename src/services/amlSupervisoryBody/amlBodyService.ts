import { Request } from "express";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";
import logger from "../../../lib/Logger";

export class AmlSupervisoryBodyService {
    public saveSelectedAML = (req: Request, acspData: AcspData) => {
        const selectedAMLSupervisoryBodies = req.body["AML-supervisory-bodies"];
        logger.info("saveSelectedAML called--->" + JSON.stringify(selectedAMLSupervisoryBodies));
        var amlSupervisoryBodies : Array<AmlSupervisoryBody>;
        if (!acspData.amlSupervisoryBodies || acspData.amlSupervisoryBodies?.length === 0) {
            logger.info("length is 0--->");
            amlSupervisoryBodies = [];
        } else {
            amlSupervisoryBodies = acspData.amlSupervisoryBodies!;
            logger.info("length is more than 0--->" + JSON.stringify(acspData.amlSupervisoryBodies?.length));
        }

        var previouslySelectedAmlBodiesName : Array<string>;
        previouslySelectedAmlBodiesName = [];
        if (amlSupervisoryBodies.length > 0) {
            logger.info("amlSupervisoryBodies length is more than 0--->");
            amlSupervisoryBodies.forEach((amlSupervisoryBody) => {
                previouslySelectedAmlBodiesName.push(amlSupervisoryBody.amlSupervisoryBody!);
            });
        }

        if (selectedAMLSupervisoryBodies instanceof Array) {
            logger.info("selectedAMLSupervisoryBodies is array--->");
            for (let i = 0; i < selectedAMLSupervisoryBodies.length; i++) {
                if (previouslySelectedAmlBodiesName.length > 0 && !previouslySelectedAmlBodiesName.includes(selectedAMLSupervisoryBodies[i])) {
                    logger.info("previouslySelectedAmlBodiesName is not empty--->");
                    amlSupervisoryBodies.push({ amlSupervisoryBody: selectedAMLSupervisoryBodies[i] });
                    logger.info("pamlSupervisoryBodies " + i + ":" + JSON.stringify(amlSupervisoryBodies));
                } else if (previouslySelectedAmlBodiesName.length === 0) {
                    amlSupervisoryBodies.push({ amlSupervisoryBody: selectedAMLSupervisoryBodies[i] });
                }
            }
            var amlSupervisoryBodiesNotInCurrentSelection : Array<AmlSupervisoryBody>;
            amlSupervisoryBodiesNotInCurrentSelection = [];
            amlSupervisoryBodies.forEach(amlSupervisoryBody => {
                logger.info("in forEach--->");
                if (!selectedAMLSupervisoryBodies.includes(amlSupervisoryBody.amlSupervisoryBody)) {
                    logger.info("selectedAMLSupervisoryBodies does not include amlSupervisoryBody--->" + amlSupervisoryBody.amlSupervisoryBody);
                    amlSupervisoryBodiesNotInCurrentSelection.push(amlSupervisoryBody);
                }
            });

            if (amlSupervisoryBodiesNotInCurrentSelection.length > 0) {
                logger.info("amlSupervisoryBodiesNotInCurrentSelection to be removed--->" + JSON.stringify(amlSupervisoryBodiesNotInCurrentSelection));
                amlSupervisoryBodiesNotInCurrentSelection.forEach(amlSupervisoryBodyToBeRemoved => {
                    var index = amlSupervisoryBodies.indexOf(amlSupervisoryBodyToBeRemoved);
                    amlSupervisoryBodies.splice(index, 1);
                    logger.info("Item removed from amlSupervisoryBodies--->" + JSON.stringify(amlSupervisoryBodies));
                });
            }
        } else {
            logger.info("in outside else");
            amlSupervisoryBodies.push({ amlSupervisoryBody: selectedAMLSupervisoryBodies });
        }
        if (acspData) {
            acspData.amlSupervisoryBodies = amlSupervisoryBodies;
        }
    }

    public saveAmlSupervisoryBodies = (req: Request, acspData: AcspData, selectedAMLSupervisoryBodies: Array<string>) => {
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
        };
    }

    public getSelectedAML = (acspData: AcspData, selectedAMLSupervisoryBodies: Array<string>) => {
        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = acspData.amlSupervisoryBodies!;
        if (amlSupervisoryBodies) {
            for (let i = 0; i < amlSupervisoryBodies.length; i++) {
                selectedAMLSupervisoryBodies.push(amlSupervisoryBodies[i].amlSupervisoryBody!);
            }
        }
    }

}
