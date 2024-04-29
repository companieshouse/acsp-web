import { body, ValidationChain } from "express-validator";

const amlSupervisoryBodiesOptions = 26;

const amlBodyMembershipNumberControllerValidator = () : ValidationChain[] => {
    const amlBodyMembershipNumberErrors : ValidationChain[] = [];
    for (let i = 1; i < amlSupervisoryBodiesOptions ; i++) {
        amlBodyMembershipNumberErrors.push(
            (body(`membershipNumber_${i}`).if(body(`membershipNumber_${i}`).exists()).trim().notEmpty().withMessage("amlIDNumberInput")));
    }
    return amlBodyMembershipNumberErrors;
};
export default amlBodyMembershipNumberControllerValidator;
