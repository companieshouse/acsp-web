import { Request } from "express";
import { AcspData, AmlSupervisoryBody } from "@companieshouse/api-sdk-node/dist/services/acsp";

export class AmlSupervisoryBodyService {
    public saveSelectedAML = (req: Request, acspData: AcspData) => {
        const selectedAMLSupervisoryBodies = req.body["AML-supervisory-bodies"];
        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = [];

        if (selectedAMLSupervisoryBodies instanceof Array) {
            for (let i = 0; i < selectedAMLSupervisoryBodies.length; i++) {
                amlSupervisoryBodies.push({ amlSupervisoryBody: selectedAMLSupervisoryBodies[i]})
            }
        } else {
            amlSupervisoryBodies.push({ amlSupervisoryBody: selectedAMLSupervisoryBodies });
        }
        if (acspData) {
            acspData.amlSupervisoryBodies = amlSupervisoryBodies;
        }
    }

    public saveAmlSupervisoryBodies = (req: Request, acspData: AcspData, selectedAMLSupervisoryBodies: Array<string>, amlSupervisoryBodies: Array<AmlSupervisoryBody>) => {
        for (let i = 0; i < selectedAMLSupervisoryBodies.length; i++){
            const j = i + 1;
            const id = "membershipNumber_" + j;
            amlSupervisoryBodies.push({
                 amlSupervisoryBody: selectedAMLSupervisoryBodies[i],
                 membershipNumber: req.body[id]
            })
        }
        if(acspData){
            acspData.amlSupervisoryBodies = amlSupervisoryBodies;
        }       
    }

    public getSelectedAML = (acspData: AcspData, selectedAMLSupervisoryBodies: Array<string>) => {
        const amlSupervisoryBodies: Array<AmlSupervisoryBody> = acspData.amlSupervisoryBodies!;
        if (amlSupervisoryBodies){
            for (let i = 0; i< amlSupervisoryBodies.length ; i++){
                selectedAMLSupervisoryBodies.push( amlSupervisoryBodies[i].amlSupervisoryBody! )
             }
        }
    }

    public getMembershipNumbers = (acspData: AcspData, selectedAMLSupervisoryBodies: Array<string>, payload: { id: number | undefined; } | undefined) => {
        for (let i = 0; i< selectedAMLSupervisoryBodies.length ; i++){
            const j = i+1;
            const id: string = "membershipNumber_" + j;
            payload = {
                id : acspData.amlSupervisoryBodies![i].membershipNumber
            }
        }
    }
}
