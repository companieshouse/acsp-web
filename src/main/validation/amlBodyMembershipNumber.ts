import { body, ValidationChain } from "express-validator";

const amlBodyMembershipNumberControllerValidator = () : ValidationChain[] => {
    const amlBodyMembershipNumberErrors : ValidationChain[] = [];
    for (let i = 1; i < 26; i++) {
        amlBodyMembershipNumberErrors.push(
        (body(`membershipNumber_${i}`).if(body(`membershipNumber_${i}`).exists()).trim().notEmpty().withMessage("amlIDNumberInput" )));
    }
    return amlBodyMembershipNumberErrors;
};
export default amlBodyMembershipNumberControllerValidator;

