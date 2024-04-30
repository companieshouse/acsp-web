import { body, ValidationChain } from "express-validator";
import { AMLSupervisoryBodies } from "../../main/model/AMLSupervisoryBodies";

const amlBodyMembershipNumberControllerValidator = (): ValidationChain[] => {
    const amlBodyMembershipNumberErrors: ValidationChain[] = [];
    const numberOfamlSupervisoryBodiesOptions = Object.keys(AMLSupervisoryBodies).length/ 2;
    for (let i = 1; i <= numberOfamlSupervisoryBodiesOptions; i++) {
        amlBodyMembershipNumberErrors.push(
            (body(`membershipNumber_${i}`).if(body(`membershipNumber_${i}`).exists()).trim().notEmpty().withMessage("amlIDNumberInput")));
    }
    return amlBodyMembershipNumberErrors;
};
export default amlBodyMembershipNumberControllerValidator;
