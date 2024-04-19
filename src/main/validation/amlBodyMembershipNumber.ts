
/*import { body } from "express-validator";

export const amlBodyMembershipNumberControllerValidator = [
    body("membershipNumber_1").notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_2").notEmpty().withMessage("amlIDNumberInput"),
    body("membershipNumber_3").notEmpty().withMessage("amlIDNumberInput")
];*/

import { Session } from "@companieshouse/node-session-handler";
import { body, ValidationChain } from "express-validator";
import { AML_SUPERVISOR_SELECTED } from "../common/__utils/constants";

/*export const amlBodyMembershipNumberControllerValidator: ValidationChain[] = [];
const customValidator = (value: any, { req }: any) => {
    const session: Session = req.session as any as Session;
    const selectedAMLSupervisoryBodies: string[] | undefined = session?.getExtraData(AML_SUPERVISOR_SELECTED);
    if (selectedAMLSupervisoryBodies) {
        for (let i = 0; i < selectedAMLSupervisoryBodies.length; i++) {
            const bodyName = selectedAMLSupervisoryBodies[i];

            const validationRule = body(`membershipNumber_${i + 1}`).trim().notEmpty().withMessage("amlIDNumberInput").bail();
            amlBodyMembershipNumberControllerValidator.push(validationRule);
        }
    }


}

amlBodyMembershipNumberControllerValidator.push(body('*').custom(customValidator));*/


export const amlBodyMembershipNumberControllerValidator = [
    body('/^membershipNumber_\d+$/').trim().notEmpty().withMessage("amlIDNumberInput").bail()
    //body('membershipNumber_2').trim().notEmpty().withMessage("amlIDNumberInput").bail(),
   // body('membershipNumber_3').trim().notEmpty().withMessage("amlIDNumberInput").bail()
    
]