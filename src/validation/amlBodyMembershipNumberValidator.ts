import { body, ValidationChain } from "express-validator";
import { AMLSupervisoryBodies } from "../model/AMLSupervisoryBodies";

const amlBodyMembershipNumberValidator = (): ValidationChain[] => {
    const amlBodyMembershipNumberErrors: ValidationChain[] = [];
    const numberOfamlSupervisoryBodies = Object.keys(AMLSupervisoryBodies).length;
    for (let i = 1; i <= numberOfamlSupervisoryBodies; i++) {
        amlBodyMembershipNumberErrors.push(
            (body(`membershipNumber_${i}`).if(body(`membershipNumber_${i}`).exists()).trim().notEmpty().withMessage("amlIDNumberInput").bail().isLength({ max: 256 }).withMessage("amlIdLength")));
    }
    return amlBodyMembershipNumberErrors;
};
export default amlBodyMembershipNumberValidator;
