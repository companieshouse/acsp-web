import { body, ValidationChain } from "express-validator";
import { AMLSupervisoryBodies } from "../model/AMLSupervisoryBodies";

const amlBodyMembershipNumberControllerValidator = (): ValidationChain[] => {
    const amlBodyMembershipNumberErrors: ValidationChain[] = [];
    const numberOfamlSupervisoryBodies = Object.keys(AMLSupervisoryBodies).length / 2;
    for (let i = 1; i <= numberOfamlSupervisoryBodies; i++) {
        amlBodyMembershipNumberErrors.push(
            (body(`membershipNumber_${i}`).if(body(`membershipNumber_${i}`).exists()).trim().notEmpty().withMessage("amlIDNumberInput")));
    }
    return amlBodyMembershipNumberErrors;
};
export default amlBodyMembershipNumberControllerValidator;
