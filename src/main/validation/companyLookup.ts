import { body } from "express-validator";
import { ACSPServiceClient } from "../../main/clients/ASCPServiceClient";
import * as config from "../../main/config/index";

const characterPattern:RegExp = /^[a-zA-Z0-9]+$/;
export const companyNumberValidator = [
    body("companyNumber").trim().notEmpty().withMessage("invalidcompanyNumberNoData").bail()
        .matches(characterPattern).withMessage("invalidcompanyNumberPattern").bail()
        .isLength({ min: 8, max: 8 }).withMessage("invalidcompanyNumbercharacterLimit").bail()
        .custom(async (value: string) => {
            // Call backend error to show on the frontend
            const acspServiceClient = new ACSPServiceClient(config.ACSP_API_LOCALHOST);
            await acspServiceClient.getCompany(value);

        })

];
